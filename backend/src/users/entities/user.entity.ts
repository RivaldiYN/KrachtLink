import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Campaign } from '../../campaigns/entities/campaign.entity';
import { CampaignMember } from '../../campaigns/entities/campaign-member.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { Wallet } from '../../transactions/entities/wallet.entity';
import { Content } from '../../contents/entities/content.entity';
import { MediaLibrary } from '../../media/entities/media-library.entity';
import { Event } from '../../events/entities/event.entity';
import { Forum } from '../../forums/entities/forum.entity';
import { ForumReply } from '../../forums/entities/forum-reply.entity';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  MEMBER = 'member',
}

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column('text', { nullable: true })
  bio: string;

  @Column('simple-array', { nullable: true })
  skills: string[];

  @Column('json', { nullable: true })
  socialLinks: {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
    youtube?: string;
    website?: string;
  };

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  googleId: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  emailVerifiedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Campaign, (campaign) => campaign.createdBy)
  createdCampaigns: Campaign[];

  @OneToMany(() => CampaignMember, (campaignMember) => campaignMember.member)
  campaignMemberships: CampaignMember[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToOne(() => Wallet, (wallet) => wallet.user)
  wallet: Wallet;

  @OneToMany(() => Content, (content) => content.createdBy)
  contents: Content[];

  @OneToMany(() => MediaLibrary, (media) => media.uploadedBy)
  uploadedMedia: MediaLibrary[];

  @OneToMany(() => Event, (event) => event.createdBy)
  createdEvents: Event[];

  @OneToMany(() => Forum, (forum) => forum.user)
  forumPosts: Forum[];

  @OneToMany(() => ForumReply, (reply) => reply.user)
  forumReplies: ForumReply[];
}