import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Event, EventStatus, EventType } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
      constructor(
            @InjectRepository(Event)
            private readonly eventRepository: Repository<Event>,
      ) { }

      async create(createEventDto: CreateEventDto, createdById: string): Promise<Event> {
            const event = this.eventRepository.create({
                  ...createEventDto,
                  createdBy: { id: createdById },
            });

            return this.eventRepository.save(event);
      }

      async findAll(
            page: number = 1,
            limit: number = 10,
            status?: EventStatus,
            type?: EventType,
      ): Promise<{ events: Event[]; total: number }> {
            const queryBuilder = this.eventRepository
                  .createQueryBuilder('event')
                  .leftJoinAndSelect('event.createdBy', 'createdBy');

            if (status) {
                  queryBuilder.andWhere('event.status = :status', { status });
            }

            if (type) {
                  queryBuilder.andWhere('event.type = :type', { type });
            }

            const [events, total] = await queryBuilder
                  .skip((page - 1) * limit)
                  .take(limit)
                  .orderBy('event.date', 'ASC')
                  .getManyAndCount();

            return { events, total };
      }

      async findUpcoming(limit: number = 10): Promise<Event[]> {
            return this.eventRepository.find({
                  where: {
                        status: EventStatus.UPCOMING,
                        date: MoreThan(new Date()),
                  },
                  relations: ['createdBy'],
                  order: { date: 'ASC' },
                  take: limit,
            });
      }

      async findOne(id: string): Promise<Event> {
            const event = await this.eventRepository.findOne({
                  where: { id },
                  relations: ['createdBy'],
            });

            if (!event) {
                  throw new NotFoundException('Event not found');
            }

            return event;
      }

      async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
            const event = await this.findOne(id);
            Object.assign(event, updateEventDto);
            return this.eventRepository.save(event);
      }

      async remove(id: string): Promise<void> {
            const event = await this.findOne(id);
            await this.eventRepository.remove(event);
      }

      async joinEvent(eventId: string, userId: string): Promise<Event> {
            const event = await this.findOne(eventId);

            if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
                  throw new Error('Event is full');
            }

            if (event.status !== EventStatus.UPCOMING) {
                  throw new Error('Event is not available for registration');
            }

            event.currentParticipants += 1;
            return this.eventRepository.save(event);
      }

      async leaveEvent(eventId: string, userId: string): Promise<Event> {
            const event = await this.findOne(eventId);
            event.currentParticipants = Math.max(0, event.currentParticipants - 1);
            return this.eventRepository.save(event);
      }

      async updateStatus(id: string, status: EventStatus): Promise<Event> {
            const event = await this.findOne(id);
            event.status = status;
            return this.eventRepository.save(event);
      }

      async getEventStats(): Promise<{
            total: number;
            upcoming: number;
            ongoing: number;
            completed: number;
            totalParticipants: number;
      }> {
            const [
                  total,
                  upcoming,
                  ongoing,
                  completed,
                  participantsResult,
            ] = await Promise.all([
                  this.eventRepository.count(),
                  this.eventRepository.count({ where: { status: EventStatus.UPCOMING } }),
                  this.eventRepository.count({ where: { status: EventStatus.ONGOING } }),
                  this.eventRepository.count({ where: { status: EventStatus.COMPLETED } }),
                  this.eventRepository
                        .createQueryBuilder('event')
                        .select('SUM(event.currentParticipants)', 'total')
                        .getRawOne(),
            ]);

            return {
                  total,
                  upcoming,
                  ongoing,
                  completed,
                  totalParticipants: parseInt(participantsResult.total) || 0,
            };
      }
}