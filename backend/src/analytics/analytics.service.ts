import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';
import { Campaign, CampaignStatus } from '../campaigns/entities/campaign.entity';
import { Transaction, TransactionType, TransactionStatus } from '../transactions/entities/transaction.entity';
import { Content, ContentStatus } from '../contents/entities/content.entity';
import { Event, EventStatus } from '../events/entities/event.entity';
import { Forum } from '../forums/entities/forum.entity';

@Injectable()
export class AnalyticsService {
      constructor(
            @InjectRepository(User)
            private readonly userRepository: Repository<User>,
            @InjectRepository(Campaign)
            private readonly campaignRepository: Repository<Campaign>,
            @InjectRepository(Transaction)
            private readonly transactionRepository: Repository<Transaction>,
            @InjectRepository(Content)
            private readonly contentRepository: Repository<Content>,
            @InjectRepository(Event)
            private readonly eventRepository: Repository<Event>,
            @InjectRepository(Forum)
            private readonly forumRepository: Repository<Forum>,
      ) { }

      async getDashboardOverview() {
            const [
                  totalUsers,
                  activeUsers,
                  totalCampaigns,
                  activeCampaigns,
                  totalTransactions,
                  totalRevenue,
                  totalContent,
                  publishedContent,
            ] = await Promise.all([
                  this.userRepository.count(),
                  this.userRepository.count({ where: { status: UserStatus.ACTIVE } }),
                  this.campaignRepository.count(),
                  this.campaignRepository.count({ where: { status: CampaignStatus.ACTIVE } }),
                  this.transactionRepository.count(),
                  this.getTotalRevenue(),
                  this.contentRepository.count(),
                  this.contentRepository.count({ where: { status: ContentStatus.PUBLISHED } }),
            ]);

            return {
                  users: {
                        total: totalUsers,
                        active: activeUsers,
                        growth: await this.getUserGrowthRate(),
                  },
                  campaigns: {
                        total: totalCampaigns,
                        active: activeCampaigns,
                        success_rate: await this.getCampaignSuccessRate(),
                  },
                  transactions: {
                        total: totalTransactions,
                        total_revenue: totalRevenue,
                        growth: await this.getRevenueGrowthRate(),
                  },
                  content: {
                        total: totalContent,
                        published: publishedContent,
                        engagement_rate: await this.getContentEngagementRate(),
                  },
            };
      }

      async getUserAnalytics(period: string = '30d') {
            const dateRange = this.getDateRange(period);

            const userRegistrations = await this.userRepository
                  .createQueryBuilder('user')
                  .select([
                        'DATE(user.createdAt) as date',
                        'COUNT(*) as count',
                        'user.role as role'
                  ])
                  .where('user.createdAt >= :startDate', { startDate: dateRange.start })
                  .groupBy('DATE(user.createdAt), user.role')
                  .orderBy('date', 'ASC')
                  .getRawMany();

            const usersByStatus = await this.userRepository
                  .createQueryBuilder('user')
                  .select('user.status', 'status')
                  .addSelect('COUNT(*)', 'count')
                  .groupBy('user.status')
                  .getRawMany();

            const usersByRole = await this.userRepository
                  .createQueryBuilder('user')
                  .select('user.role', 'role')
                  .addSelect('COUNT(*)', 'count')
                  .groupBy('user.role')
                  .getRawMany();

            return {
                  registrations: userRegistrations,
                  by_status: usersByStatus,
                  by_role: usersByRole,
                  total_active: await this.userRepository.count({ where: { status: UserStatus.ACTIVE } }),
            };
      }

      async getCampaignAnalytics(period: string = '30d') {
            const dateRange = this.getDateRange(period);

            const campaignsByStatus = await this.campaignRepository
                  .createQueryBuilder('campaign')
                  .select('campaign.status', 'status')
                  .addSelect('COUNT(*)', 'count')
                  .groupBy('campaign.status')
                  .getRawMany();

            const campaignsOverTime = await this.campaignRepository
                  .createQueryBuilder('campaign')
                  .select('DATE(campaign.createdAt) as date')
                  .addSelect('COUNT(*) as count')
                  .where('campaign.createdAt >= :startDate', { startDate: dateRange.start })
                  .groupBy('DATE(campaign.createdAt)')
                  .orderBy('date', 'ASC')
                  .getRawMany();

            const topPerformingCampaigns = await this.campaignRepository
                  .createQueryBuilder('campaign')
                  .leftJoinAndSelect('campaign.members', 'members')
                  .select([
                        'campaign.id',
                        'campaign.title',
                        'COUNT(members.id) as member_count',
                        'campaign.status'
                  ])
                  .groupBy('campaign.id')
                  .orderBy('member_count', 'DESC')
                  .limit(10)
                  .getRawMany();

            return {
                  by_status: campaignsByStatus,
                  over_time: campaignsOverTime,
                  top_performing: topPerformingCampaigns,
                  success_rate: await this.getCampaignSuccessRate(),
            };
      }

      async getFinancialAnalytics(period: string = '30d') {
            const dateRange = this.getDateRange(period);

            const revenueOverTime = await this.transactionRepository
                  .createQueryBuilder('transaction')
                  .select('DATE(transaction.createdAt) as date')
                  .addSelect('SUM(transaction.amount) as total_amount')
                  .addSelect('transaction.type as type')
                  .where('transaction.createdAt >= :startDate', { startDate: dateRange.start })
                  .andWhere('transaction.status = :status', { status: TransactionStatus.SUCCESS })
                  .groupBy('DATE(transaction.createdAt), transaction.type')
                  .orderBy('date', 'ASC')
                  .getRawMany();

            const transactionsByType = await this.transactionRepository
                  .createQueryBuilder('transaction')
                  .select('transaction.type', 'type')
                  .addSelect('COUNT(*)', 'count')
                  .addSelect('SUM(transaction.amount)', 'total_amount')
                  .where('transaction.status = :status', { status: TransactionStatus.SUCCESS })
                  .groupBy('transaction.type')
                  .getRawMany();

            const monthlyRevenue = await this.transactionRepository
                  .createQueryBuilder('transaction')
                  .select('EXTRACT(MONTH FROM transaction.createdAt) as month')
                  .addSelect('EXTRACT(YEAR FROM transaction.createdAt) as year')
                  .addSelect('SUM(transaction.amount) as total_amount')
                  .where('transaction.type = :type', { type: TransactionType.INCOME })
                  .andWhere('transaction.status = :status', { status: TransactionStatus.SUCCESS })
                  .groupBy('EXTRACT(MONTH FROM transaction.createdAt), EXTRACT(YEAR FROM transaction.createdAt)')
                  .orderBy('year', 'ASC')
                  .addOrderBy('month', 'ASC')
                  .getRawMany();

            return {
                  revenue_over_time: revenueOverTime,
                  transactions_by_type: transactionsByType,
                  monthly_revenue: monthlyRevenue,
                  total_revenue: await this.getTotalRevenue(),
            };
      }

      async getContentAnalytics(period: string = '30d') {
            const dateRange = this.getDateRange(period);

            const contentByType = await this.contentRepository
                  .createQueryBuilder('content')
                  .select('content.type', 'type')
                  .addSelect('COUNT(*)', 'count')
                  .addSelect('AVG(content.viewCount)', 'avg_views')
                  .groupBy('content.type')
                  .getRawMany();

            const contentOverTime = await this.contentRepository
                  .createQueryBuilder('content')
                  .select('DATE(content.createdAt) as date')
                  .addSelect('COUNT(*) as count')
                  .where('content.createdAt >= :startDate', { startDate: dateRange.start })
                  .groupBy('DATE(content.createdAt)')
                  .orderBy('date', 'ASC')
                  .getRawMany();

            const topContent = await this.contentRepository
                  .createQueryBuilder('content')
                  .select([
                        'content.id',
                        'content.title',
                        'content.viewCount',
                        'content.likeCount',
                        'content.shareCount',
                        'content.type'
                  ])
                  .orderBy('content.viewCount', 'DESC')
                  .limit(10)
                  .getRawMany();

            return {
                  by_type: contentByType,
                  over_time: contentOverTime,
                  top_content: topContent,
                  engagement_rate: await this.getContentEngagementRate(),
            };
      }

      async getEngagementAnalytics() {
            const forumStats = await this.forumRepository
                  .createQueryBuilder('forum')
                  .select('COUNT(*) as total_posts')
                  .addSelect('AVG(forum.viewCount) as avg_views')
                  .addSelect('SUM(forum.likeCount) as total_likes')
                  .getRawOne();

            const activeUsers7Days = await this.userRepository
                  .createQueryBuilder('user')
                  .where('user.lastLoginAt >= :date', {
                        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  })
                  .getCount();

            const activeUsers30Days = await this.userRepository
                  .createQueryBuilder('user')
                  .where('user.lastLoginAt >= :date', {
                        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                  })
                  .getCount();

            return {
                  forum_stats: forumStats,
                  active_users_7d: activeUsers7Days,
                  active_users_30d: activeUsers30Days,
                  user_retention: {
                        weekly: activeUsers7Days,
                        monthly: activeUsers30Days,
                  },
            };
      }

      // Helper methods
      private async getUserGrowthRate(): Promise<number> {
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);

            const currentMonthUsers = await this.userRepository.count({
                  where: { createdAt: { $gte: lastMonth } as any }
            });

            const previousMonth = new Date();
            previousMonth.setMonth(previousMonth.getMonth() - 2);

            const lastMonthUsers = await this.userRepository.count({
                  where: {
                        createdAt: {
                              $gte: previousMonth,
                              $lt: lastMonth
                        } as any
                  }
            });

            if (lastMonthUsers === 0) return 100;
            return ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100;
      }

      private async getCampaignSuccessRate(): Promise<number> {
            const totalCampaigns = await this.campaignRepository.count();
            const completedCampaigns = await this.campaignRepository.count({
                  where: { status: CampaignStatus.COMPLETED }
            });

            if (totalCampaigns === 0) return 0;
            return (completedCampaigns / totalCampaigns) * 100;
      }

      private async getTotalRevenue(): Promise<number> {
            const result = await this.transactionRepository
                  .createQueryBuilder('transaction')
                  .select('SUM(transaction.amount)', 'total')
                  .where('transaction.type = :type', { type: TransactionType.INCOME })
                  .andWhere('transaction.status = :status', { status: TransactionStatus.SUCCESS })
                  .getRawOne();

            return parseFloat(result.total) || 0;
      }

      private async getRevenueGrowthRate(): Promise<number> {
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);

            const currentResult = await this.transactionRepository
                  .createQueryBuilder('transaction')
                  .select('SUM(transaction.amount)', 'total')
                  .where('transaction.type = :type', { type: TransactionType.INCOME })
                  .andWhere('transaction.status = :status', { status: TransactionStatus.SUCCESS })
                  .andWhere('transaction.createdAt >= :date', { date: lastMonth })
                  .getRawOne();

            const previousMonth = new Date();
            previousMonth.setMonth(previousMonth.getMonth() - 2);

            const lastResult = await this.transactionRepository
                  .createQueryBuilder('transaction')
                  .select('SUM(transaction.amount)', 'total')
                  .where('transaction.type = :type', { type: TransactionType.INCOME })
                  .andWhere('transaction.status = :status', { status: TransactionStatus.SUCCESS })
                  .andWhere('transaction.createdAt >= :startDate', { startDate: previousMonth })
                  .andWhere('transaction.createdAt < :endDate', { endDate: lastMonth })
                  .getRawOne();

            const currentRevenue = parseFloat(currentResult.total) || 0;
            const lastRevenue = parseFloat(lastResult.total) || 0;

            if (lastRevenue === 0) return 100;
            return ((currentRevenue - lastRevenue) / lastRevenue) * 100;
      }

      private async getContentEngagementRate(): Promise<number> {
            const result = await this.contentRepository
                  .createQueryBuilder('content')
                  .select('AVG((content.likeCount + content.shareCount) / NULLIF(content.viewCount, 0) * 100)', 'rate')
                  .where('content.viewCount > 0')
                  .getRawOne();

            return parseFloat(result.rate) || 0;
      }

      private getDateRange(period: string) {
            const end = new Date();
            const start = new Date();

            switch (period) {
                  case '7d':
                        start.setDate(start.getDate() - 7);
                        break;
                  case '30d':
                        start.setDate(start.getDate() - 30);
                        break;
                  case '90d':
                        start.setDate(start.getDate() - 90);
                        break;
                  case '1y':
                        start.setFullYear(start.getFullYear() - 1);
                        break;
                  default:
                        start.setDate(start.getDate() - 30);
            }

            return { start, end };
      }
}