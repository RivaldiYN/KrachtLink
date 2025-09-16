import {
      Entity,
      PrimaryGeneratedColumn,
      Column,
      CreateDateColumn,
      UpdateDateColumn,
      ManyToOne,
      OneToMany,
      JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CampaignMember } from './campaign-member.entity';

export enum CampaignStatus {
      DRAFT = 'draft',
      ACTIVE = 'active',
      COMPLETED = 'completed',
}

@Entity('campaigns')
export class Campaign {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column({ length: 200 })
      title: string;

      @Column('text')
      description: string;

      @Column({ type: 'timestamp' })
      startDate: Date;

      @Column({ type: 'timestamp' })
      endDate: Date;

      @Column({ type: 'integer' })
      target: number;

      @Column({ type: 'decimal', precision: 10, scale: 2 })
      reward: number;

      @Column({
            type: 'enum',
            enum: CampaignStatus,
            default: CampaignStatus.DRAFT,
      })
      status: CampaignStatus;

      @Column('json', { nullable: true })
      requirements: {
            minFollowers?: number;
            platforms?: string[];
            skills?: string[];
            location?: string[];
      };

      @Column('json', { nullable: true })
      socialMediaTracking: {
            hashtags?: string[];
            mentions?: string[];
            trackingUrls?: string[];
      };

      @Column({ nullable: true })
      coverImage: string;

      @Column('simple-array', { nullable: true })
      tags: string[];

      @CreateDateColumn()
      createdAt: Date;

      @UpdateDateColumn()
      updatedAt: Date;

      // Relations
      @ManyToOne(() => User, (user) => user.createdCampaigns)
      @JoinColumn({ name: 'created_by' })
      createdBy: User;

      @OneToMany(() => CampaignMember, (campaignMember) => campaignMember.campaign)
      members: CampaignMember[];
}