import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign, CampaignStatus } from './entities/campaign.entity';
import { CampaignMember, CampaignMemberStatus } from './entities/campaign-member.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { JoinCampaignDto } from './dto/join-campaign.dto';

@Injectable()
export class CampaignsService {
      constructor(
            @InjectRepository(Campaign)
            private readonly campaignRepository: Repository<Campaign>,
            @InjectRepository(CampaignMember)
            private readonly campaignMemberRepository: Repository<CampaignMember>,
      ) { }

      async create(createCampaignDto: CreateCampaignDto, createdById: string): Promise<Campaign> {
            const campaign = this.campaignRepository.create({
                  ...createCampaignDto,
                  createdBy: { id: createdById },
            });

            return this.campaignRepository.save(campaign);
      }

      async findAll(
            page: number = 1,
            limit: number = 10,
            status?: CampaignStatus,
      ): Promise<{ campaigns: Campaign[]; total: number }> {
            const queryBuilder = this.campaignRepository
                  .createQueryBuilder('campaign')
                  .leftJoinAndSelect('campaign.createdBy', 'createdBy')
                  .leftJoinAndSelect('campaign.members', 'members')
                  .leftJoinAndSelect('members.member', 'member');

            if (status) {
                  queryBuilder.where('campaign.status = :status', { status });
            }

            const [campaigns, total] = await queryBuilder
                  .skip((page - 1) * limit)
                  .take(limit)
                  .orderBy('campaign.createdAt', 'DESC')
                  .getManyAndCount();

            return { campaigns, total };
      }

      async findActive(): Promise<Campaign[]> {
            return this.campaignRepository.find({
                  where: {
                        status: CampaignStatus.ACTIVE,
                        startDate: { $lte: new Date() } as any,
                        endDate: { $gte: new Date() } as any,
                  },
                  relations: ['createdBy'],
                  order: { createdAt: 'DESC' },
            });
      }

      async findOne(id: string): Promise<Campaign> {
            const campaign = await this.campaignRepository.findOne({
                  where: { id },
                  relations: ['createdBy', 'members', 'members.member'],
            });

            if (!campaign) {
                  throw new NotFoundException('Campaign not found');
            }

            return campaign;
      }

      async update(id: string, updateCampaignDto: UpdateCampaignDto, userId: string): Promise<Campaign> {
            const campaign = await this.findOne(id);

            if (campaign.createdBy.id !== userId) {
                  throw new ForbiddenException('You can only update your own campaigns');
            }

            Object.assign(campaign, updateCampaignDto);
            return this.campaignRepository.save(campaign);
      }

      async remove(id: string, userId: string): Promise<void> {
            const campaign = await this.findOne(id);

            if (campaign.createdBy.id !== userId) {
                  throw new ForbiddenException('You can only delete your own campaigns');
            }

            await this.campaignRepository.softDelete(id);
      }

      async joinCampaign(campaignId: string, userId: string, joinDto: JoinCampaignDto): Promise<CampaignMember> {
            const campaign = await this.findOne(campaignId);

            if (campaign.status !== CampaignStatus.ACTIVE) {
                  throw new ForbiddenException('Campaign is not active');
            }

            // Check if already joined
            const existingMember = await this.campaignMemberRepository.findOne({
                  where: {
                        campaign: { id: campaignId },
                        member: { id: userId },
                  },
            });

            if (existingMember) {
                  throw new ForbiddenException('Already joined this campaign');
            }

            const campaignMember = this.campaignMemberRepository.create({
                  campaign: { id: campaignId },
                  member: { id: userId },
                  notes: joinDto.notes,
            });

            return this.campaignMemberRepository.save(campaignMember);
      }

      async leaveCampaign(campaignId: string, userId: string): Promise<void> {
            const campaignMember = await this.campaignMemberRepository.findOne({
                  where: {
                        campaign: { id: campaignId },
                        member: { id: userId },
                  },
            });

            if (!campaignMember) {
                  throw new NotFoundException('Campaign membership not found');
            }

            campaignMember.status = CampaignMemberStatus.CANCELLED;
            await this.campaignMemberRepository.save(campaignMember);
      }

      async updateProgress(
            campaignId: string,
            userId: string,
            progress: any,
      ): Promise<CampaignMember> {
            const campaignMember = await this.campaignMemberRepository.findOne({
                  where: {
                        campaign: { id: campaignId },
                        member: { id: userId },
                  },
            });

            if (!campaignMember) {
                  throw new NotFoundException('Campaign membership not found');
            }

            campaignMember.progress = { ...campaignMember.progress, ...progress };
            return this.campaignMemberRepository.save(campaignMember);
      }

      async getMyCampaigns(userId: string): Promise<CampaignMember[]> {
            return this.campaignMemberRepository.find({
                  where: { member: { id: userId } },
                  relations: ['campaign', 'campaign.createdBy'],
                  order: { createdAt: 'DESC' },
            });
      }

      async getCampaignStats(campaignId: string): Promise<any> {
            const campaign = await this.findOne(campaignId);
            const members = await this.campaignMemberRepository.find({
                  where: { campaign: { id: campaignId } },
            });

            const totalMembers = members.length;
            const activeMembers = members.filter(m => m.status === CampaignMemberStatus.ONGOING).length;
            const completedMembers = members.filter(m => m.status === CampaignMemberStatus.FINISHED).length;

            const totalProgress = members.reduce((acc, member) => {
                  const progress = member.progress || {};
                  acc.shares += progress.shares || 0;
                  acc.likes += progress.likes || 0;
                  acc.comments += progress.comments || 0;
                  acc.views += progress.views || 0;
                  return acc;
            }, { shares: 0, likes: 0, comments: 0, views: 0 });

            return {
                  campaign,
                  totalMembers,
                  activeMembers,
                  completedMembers,
                  totalProgress,
                  completionRate: totalMembers > 0 ? (completedMembers / totalMembers) * 100 : 0,
            };
      }
}