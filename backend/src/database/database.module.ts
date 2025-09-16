import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Entities
import { User } from '../users/entities/user.entity';
import { Campaign } from '../campaigns/entities/campaign.entity';
import { CampaignMember } from '../campaigns/entities/campaign-member.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { Wallet } from '../transactions/entities/wallet.entity';
import { Content } from '../contents/entities/content.entity';
import { MediaLibrary } from '../media/entities/media-library.entity';
import { Event } from '../events/entities/event.entity';
import { Forum } from '../forums/entities/forum.entity';
import { ForumReply } from '../forums/entities/forum-reply.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [
          User,
          Campaign,
          CampaignMember,
          Transaction,
          Wallet,
          Content,
          MediaLibrary,
          Event,
          Forum,
          ForumReply,
        ],
        synchronize: configService.get('DATABASE_SYNCHRONIZE') === 'true',
        logging: configService.get('NODE_ENV') === 'development',
        ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}