import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaLibrary, MediaType } from './entities/media-library.entity';
import { UploadMediaDto } from './dto/upload-media.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MediaService {
      constructor(
            @InjectRepository(MediaLibrary)
            private readonly mediaRepository: Repository<MediaLibrary>,
      ) { }

      async uploadMedia(
            file: Express.Multer.File,
            uploadMediaDto: UploadMediaDto,
            uploadedById: string,
      ): Promise<MediaLibrary> {
            const mediaType = this.getMediaType(file.mimetype);

            const media = this.mediaRepository.create({
                  fileName: file.filename,
                  originalName: file.originalname,
                  fileUrl: `/uploads/${file.filename}`,
                  type: mediaType,
                  fileSize: file.size,
                  mimeType: file.mimetype,
                  metadata: uploadMediaDto.metadata,
                  uploadedBy: { id: uploadedById },
            });

            return this.mediaRepository.save(media);
      }

      async findAll(
            page: number = 1,
            limit: number = 20,
            type?: MediaType,
            userId?: string,
      ): Promise<{ media: MediaLibrary[]; total: number }> {
            const queryBuilder = this.mediaRepository
                  .createQueryBuilder('media')
                  .leftJoinAndSelect('media.uploadedBy', 'uploadedBy');

            if (type) {
                  queryBuilder.andWhere('media.type = :type', { type });
            }

            if (userId) {
                  queryBuilder.andWhere('media.uploadedBy = :userId', { userId });
            }

            const [media, total] = await queryBuilder
                  .skip((page - 1) * limit)
                  .take(limit)
                  .orderBy('media.createdAt', 'DESC')
                  .getManyAndCount();

            return { media, total };
      }

      async findOne(id: string): Promise<MediaLibrary> {
            const media = await this.mediaRepository.findOne({
                  where: { id },
                  relations: ['uploadedBy'],
            });

            if (!media) {
                  throw new NotFoundException('Media not found');
            }

            return media;
      }

      async updateMetadata(id: string, metadata: any): Promise<MediaLibrary> {
            const media = await this.findOne(id);
            media.metadata = { ...media.metadata, ...metadata };
            return this.mediaRepository.save(media);
      }

      async remove(id: string): Promise<void> {
            const media = await this.findOne(id);

            // Delete physical file
            const filePath = path.join(process.cwd(), 'uploads', media.fileName);
            if (fs.existsSync(filePath)) {
                  fs.unlinkSync(filePath);
            }

            await this.mediaRepository.remove(media);
      }

      private getMediaType(mimeType: string): MediaType {
            if (mimeType.startsWith('image/')) {
                  return MediaType.IMAGE;
            } else if (mimeType.startsWith('video/')) {
                  return MediaType.VIDEO;
            } else {
                  return MediaType.DOCUMENT;
            }
      }

      async getStorageStats(): Promise<{
            totalFiles: number;
            totalSize: number;
            typeBreakdown: Record<MediaType, { count: number; size: number }>;
      }> {
            const media = await this.mediaRepository.find();

            const stats = {
                  totalFiles: media.length,
                  totalSize: media.reduce((sum, item) => sum + Number(item.fileSize), 0),
                  typeBreakdown: {
                        [MediaType.IMAGE]: { count: 0, size: 0 },
                        [MediaType.VIDEO]: { count: 0, size: 0 },
                        [MediaType.DOCUMENT]: { count: 0, size: 0 },
                  },
            };

            media.forEach((item) => {
                  stats.typeBreakdown[item.type].count++;
                  stats.typeBreakdown[item.type].size += Number(item.fileSize);
            });

            return stats;
      }
}