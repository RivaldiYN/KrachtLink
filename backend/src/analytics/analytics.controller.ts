import {
      Controller,
      Get,
      Query,
      UseGuards,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
export class AnalyticsController {
      constructor(private readonly analyticsService: AnalyticsService) { }

      @Get('dashboard')
      getDashboardOverview() {
            return this.analyticsService.getDashboardOverview();
      }

      @Get('users')
      getUserAnalytics(@Query('period') period: string = '30d') {
            return this.analyticsService.getUserAnalytics(period);
      }

      @Get('campaigns')
      getCampaignAnalytics(@Query('period') period: string = '30d') {
            return this.analyticsService.getCampaignAnalytics(period);
      }

      @Get('financial')
      getFinancialAnalytics(@Query('period') period: string = '30d') {
            return this.analyticsService.getFinancialAnalytics(period);
      }

      @Get('content')
      getContentAnalytics(@Query('period') period: string = '30d') {
            return this.analyticsService.getContentAnalytics(period);
      }

      @Get('engagement')
      getEngagementAnalytics() {
            return this.analyticsService.getEngagementAnalytics();
      }
}