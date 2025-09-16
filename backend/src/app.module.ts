import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ContentsModule } from './contents/contents.module';
import { MediaModule } from './media/media.module';
import { EventsModule } from './events/events.module';
import { ForumsModule } from './forums/forums.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
      imports: [
            // Configuration
            ConfigModule.forRoot({
                  isGlobal: true,
                  envFilePath: '.env',
            }),

            // Rate limiting
            ThrottlerModule.forRoot([
                  {
                        ttl: 60000, // 1 minute
                        limit: 10, // 10 requests per minute
                  },
            ]),

            // Static files
            ServeStaticModule.forRoot({
                  rootPath: join(__dirname, '..', 'uploads'),
                  serveRoot: '/uploads',
            }),

            // Database
            DatabaseModule,

            // Feature modules
            AuthModule,
            UsersModule,
            CampaignsModule,
            TransactionsModule,
            ContentsModule,
            MediaModule,
            EventsModule,
            ForumsModule,
            AnalyticsModule,
            PaymentsModule,
            NotificationsModule,
      ],
      controllers: [AppController],
      providers: [AppService],
})
export class AppModule { }