import {
      Entity,
      PrimaryGeneratedColumn,
      Column,
      CreateDateColumn,
      UpdateDateColumn,
      ManyToOne,
      JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Forum } from './forum.entity';

@Entity('forum_replies')
export class ForumReply {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column('text')
      replyContent: string;

      @Column({ type: 'integer', default: 0 })
      likeCount: number;

      @Column({ type: 'boolean', default: false })
      isAnswer: boolean;

      @CreateDateColumn()
      createdAt: Date;

      @UpdateDateColumn()
      updatedAt: Date;

      // Relations
      @ManyToOne(() => Forum, (forum) => forum.replies, { onDelete: 'CASCADE' })
      @JoinColumn({ name: 'forum_id' })
      forum: Forum;

      @ManyToOne(() => User, (user) => user.forumReplies)
      @JoinColumn({ name: 'user_id' })
      user: User;
}