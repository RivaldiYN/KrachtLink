import {
      Entity,
      PrimaryGeneratedColumn,
      Column,
      CreateDateColumn,
      UpdateDateColumn,
      ManyToOne,
      JoinColumn,
} from 'typeorm';
import { Campaign } from './campaign.entity';
import { User } from '../../users/entities/user.entity';

export enum CampaignMemberStatus {
      ONGOING = 'ongoing',
      FINISHED = 'finished',
      CANCELLED = 'cancelled',
}

@Entity('campaign_members')
export class CampaignMember {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column('json', { nullable: true })
      progress: {
            shares?: number;
            likes?: number;
            comments?: number;
            views?: number;
            clicks?: number;
            conversions?: number;
      };

      @Column({ type: 'integer', default: 0 })
      timeSpent: number; // in minutes

      @Column({
            type: 'enum',
            enum: CampaignMemberStatus,
            default: CampaignMemberStatus.ONGOING,
      })
      status: CampaignMemberStatus;

      @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
      earnedReward: number;

      @Column('json', { nullable: true })
      submissions: Array<{
            type: string;
            url: string;
            platform: string;
            timestamp: Date;
            metrics?: any;
      }>;

      @Column('text', { nullable: true })
      notes: string;

      @CreateDateColumn()
      createdAt: Date;

      @UpdateDateColumn()
      updatedAt: Date;

      // Relations
      @ManyToOne(() => Campaign, (campaign) => campaign.members)
      @JoinColumn({ name: 'campaign_id' })
      campaign: Campaign;

      @ManyToOne(() => User, (user) => user.campaignMemberships)
      @JoinColumn({ name: 'member_id' })
      member: User;
}