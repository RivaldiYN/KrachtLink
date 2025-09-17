import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { User } from '../users/entities/user.entity';
import { Campaign } from '../campaigns/entities/campaign.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { Content } from '../contents/entities/content.entity';
import { Event } from '../events/entities/event.entity';
import { Forum } from '../forums/entities/forum.entity';

@Module({
      imports: [
            TypeOrmModule.forFeature([
                  User,
                  Campaign,
                  Transaction,
                  Content,
                  Event,
                  Forum,
            ]),
      ],
      controllers: [AnalyticsController],
      providers: [AnalyticsService],
      exports: [AnalyticsService],
})
export class AnalyticsModule { }