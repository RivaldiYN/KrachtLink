import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { Campaign } from './entities/campaign.entity';
import { CampaignMember } from './entities/campaign-member.entity';
import { UsersModule } from '../users/users.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
      imports: [
            TypeOrmModule.forFeature([Campaign, CampaignMember]),
            UsersModule,
            TransactionsModule,
      ],
      controllers: [CampaignsController],
      providers: [CampaignsService],
      exports: [CampaignsService],
})
export class CampaignsModule { }