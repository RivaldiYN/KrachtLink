import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content, ContentType, ContentStatus } from './entities/content.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class ContentsService {
      constructor(
            @InjectRepository(Content)
            private readonly contentRepository: Repository<Content>,
      ) { }

      async create(createContentDto: CreateContentDto, createdById: string): Promise<Content> {
            // Generate slug for blog posts
            let slug = null;
            if (createContentDto.type === ContentType.BLOG) {
                  slug = this.generateSlug(createContentDto.title);
            }

            const content = this.contentRepository.create({
                  ...createContentDto,
                  slug,
                  createdBy: { id: createdById },
            });

            return this.contentRepository.save(content);
      }

      async findAll(
            page: number = 1,
            limit: number = 10,
            type?: ContentType,
            status?: ContentStatus,
      ): Promise<{ contents: Content[]; total: number }> {
            const queryBuilder = this.contentRepository
                  .createQueryBuilder('content')
                  .leftJoinAndSelect('content.createdBy', 'createdBy');

            if (type) {
                  queryBuilder.andWhere('content.type = :type', { type });
            }

            if (status) {
                  queryBuilder.andWhere('content.status = :status', { status });
            }

            const [contents, total] = await queryBuilder
                  .skip((page - 1) * limit)
                  .take(limit)
                  .orderBy('content.createdAt', 'DESC')
                  .getManyAndCount();

            return { contents, total };
      }

      async findPublished(
            page: number = 1,
            limit: number = 10,
            type?: ContentType,
      ): Promise<{ contents: Content[]; total: number }> {
            return this.findAll(page, limit, type, ContentStatus.PUBLISHED);
      }

      async findByType(type: ContentType): Promise<Content[]> {
            return this.contentRepository.find({
                  where: {
                        type,
                        status: ContentStatus.PUBLISHED
                  },
                  relations: ['createdBy'],
                  order: { createdAt: 'DESC' },
            });
      }

      async findOne(id: string): Promise<Content> {
            const content = await this.contentRepository.findOne({
                  where: { id },
                  relations: ['createdBy'],
            });

            if (!content) {
                  throw new NotFoundException('Content not found');
            }

            return content;
      }

      async findBySlug(slug: string): Promise<Content> {
            const content = await this.contentRepository.findOne({
                  where: {
                        slug,
                        status: ContentStatus.PUBLISHED
                  },
                  relations: ['createdBy'],
            });

            if (!content) {
                  throw new NotFoundException('Content not found');
            }

            // Increment view count
            content.viewCount += 1;
            await this.contentRepository.save(content);

            return content;
      }

      async update(id: string, updateContentDto: UpdateContentDto): Promise<Content> {
            const content = await this.findOne(id);

            // Update slug if title changed for blog posts
            if (updateContentDto.title && content.type === ContentType.BLOG) {
                  updateContentDto.slug = this.generateSlug(updateContentDto.title);
            }

            Object.assign(content, updateContentDto);

            // Set published date if status changed to published
            if (updateContentDto.status === ContentStatus.PUBLISHED && !content.publishedAt) {
                  content.publishedAt = new Date();
            }

            return this.contentRepository.save(content);
      }

      async remove(id: string): Promise<void> {
            const content = await this.findOne(id);
            await this.contentRepository.remove(content);
      }

      async incrementView(id: string): Promise<void> {
            await this.contentRepository.increment({ id }, 'viewCount', 1);
      }

      async incrementLike(id: string): Promise<void> {
            await this.contentRepository.increment({ id }, 'likeCount', 1);
      }

      async incrementShare(id: string): Promise<void> {
            await this.contentRepository.increment({ id }, 'shareCount', 1);
      }

      private generateSlug(title: string): string {
            return title
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/(^-|-$)/g, '');
      }

      async getPopularContent(limit: number = 10): Promise<Content[]> {
            return this.contentRepository.find({
                  where: { status: ContentStatus.PUBLISHED },
                  order: { viewCount: 'DESC' },
                  take: limit,
                  relations: ['createdBy'],
            });
      }

}