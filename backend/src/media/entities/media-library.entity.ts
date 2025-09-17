import {
      Entity,
      PrimaryGeneratedColumn,
      Column,
      CreateDateColumn,
      ManyToOne,
      JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum MediaType {
      IMAGE = 'image',
      VIDEO = 'video',
      DOCUMENT = 'doc',
}

@Entity('media_library')
export class MediaLibrary {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column({ length: 255 })
      fileName: string;

      @Column({ length: 255 })
      originalName: string;

      @Column()
      fileUrl: string;

      @Column({
            type: 'enum',
            enum: MediaType,
      })
      type: MediaType;

      @Column({ type: 'bigint' })
      fileSize: number;

      @Column({ length: 100 })
      mimeType: string;

      @Column('json', { nullable: true })
      metadata: {
            width?: number;
            height?: number;
            duration?: number;
            alt?: string;
            caption?: string;
      };

      @CreateDateColumn()
      createdAt: Date;

      // Relations
      @ManyToOne(() => User, (user) => user.uploadedMedia)
      @JoinColumn({ name: 'uploaded_by' })
      uploadedBy: User;
}