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
import { ForumReply } from './forum-reply.entity';

export enum ForumCategory {
      GENERAL = 'general',
      CAMPAIGNS = 'campaigns',
      TIPS = 'tips',
      SUPPORT = 'support',
      FEEDBACK = 'feedback',
      SHOWCASE = 'showcase',
}

@Entity('forums')
export class Forum {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column({ length: 300 })
      title: string;

      @Column('text')
      content: string;

      @Column({
            type: 'enum',
            enum: ForumCategory,
            default: ForumCategory.GENERAL,
      })
      category: ForumCategory;

      @Column('simple-array', { nullable: true })
      tags: string[];

      @Column({ type: 'boolean', default: false })
      isPinned: boolean;

      @Column({ type: 'boolean', default: false })
      isLocked: boolean;

      @Column({ type: 'integer', default: 0 })
      viewCount: number;

      @Column({ type: 'integer', default: 0 })
      likeCount: number;

      @Column({ type: 'timestamp', nullable: true })
      lastReplyAt: Date;

      @CreateDateColumn()
      createdAt: Date;

      @UpdateDateColumn()
      updatedAt: Date;

      // Relations
      @ManyToOne(() => User, (user) => user.forumPosts)
      @JoinColumn({ name: 'user_id' })
      user: User;

      @OneToMany(() => ForumReply, (reply) => reply.forum)
      replies: ForumReply[];
}