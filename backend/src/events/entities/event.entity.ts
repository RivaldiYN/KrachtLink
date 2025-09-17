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

export enum EventStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum EventType {
  WEBINAR = 'webinar',
  WORKSHOP = 'workshop',
  MEETUP = 'meetup',
  CONFERENCE = 'conference',
  NETWORKING = 'networking',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: EventType,
    default: EventType.WEBINAR,
  })
  type: EventType;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ length: 500, nullable: true })
  location: string;

  @Column({ nullable: true })
  onlineLink: string;

  @Column({ type: 'integer', nullable: true })
  maxParticipants: number;

  @Column({ type: 'integer', default: 0 })
  currentParticipants: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.UPCOMING,
  })
  status: EventStatus;

  @Column({ nullable: true })
  bannerImage: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column('json', { nullable: true })
  agenda: Array<{
    time: string;
    title: string;
    description?: string;
    speaker?: string;
  }>;

  @Column('json', { nullable: true })
  speakers: Array<{
    name: string;
    title: string;
    bio: string;
    photo?: string;
  }>;

  @Column('json', { nullable: true })
  requirements: {
    memberLevel?: string;
    skills?: string[];
    experience?: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.createdEvents)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;
}