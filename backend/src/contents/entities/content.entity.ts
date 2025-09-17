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

export enum ContentType {
      HERO = 'hero',
      ABOUT = 'about',
      SERVICE = 'service',
      PORTFOLIO = 'portfolio',
      TESTIMONIAL = 'testimonial',
      BLOG = 'blog',
      NEWS = 'news',
      FAQ = 'faq',
}

export enum ContentStatus {
      DRAFT = 'draft',
      PUBLISHED = 'published',
      ARCHIVED = 'archived',
}

@Entity('contents')
export class Content {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column({
            type: 'enum',
            enum: ContentType,
      })
      type: ContentType;

      @Column({ length: 300 })
      title: string;

      @Column('text')
      body: string;

      @Column('text', { nullable: true })
      excerpt: string;

      @Column({ nullable: true })
      slug: string;

      @Column({ nullable: true })
      mediaUrl: string;

      @Column('simple-array', { nullable: true })
      images: string[];

      @Column('simple-array', { nullable: true })
      tags: string[];

      @Column({
            type: 'enum',
            enum: ContentStatus,
            default: ContentStatus.DRAFT,
      })
      status: ContentStatus;

      @Column('json', { nullable: true })
      seoMeta: {
            metaTitle?: string;
            metaDescription?: string;
            keywords?: string[];
            ogImage?: string;
      };

      @Column({ type: 'integer', default: 0 })
      viewCount: number;

      @Column({ type: 'integer', default: 0 })
      likeCount: number;

      @Column({ type: 'integer', default: 0 })
      shareCount: number;

      @Column({ type: 'timestamp', nullable: true })
      publishedAt: Date;

      @CreateDateColumn()
      createdAt: Date;

      @UpdateDateColumn()
      updatedAt: Date;

      // Relations
      @ManyToOne(() => User, (user) => user.contents)
      @JoinColumn({ name: 'created_by' })
      createdBy: User;
}