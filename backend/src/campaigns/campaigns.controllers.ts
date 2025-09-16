import {
      Controller,
      Get,
      Post,
      Body,
      Patch,
      Param,
      Delete,
      Query,
      UseGuards,
      Request,
      UploadedFile,
      UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { JoinCampaignDto } from './dto/join-campaign.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { CampaignStatus } from './entities/campaign.entity';

@Controller('campaigns')
@UseGuards(JwtAuthGuard)
export class CampaignsController {
      constructor(private readonly campaignsService: CampaignsService) { }

      @Post()
      @UseGuards(RolesGuard)
      @Roles(UserRole.SUPER_ADMIN)
      create(@Body() createCampaignDto: CreateCampaignDto, @Request() req) {
            return this.campaignsService.create(createCampaignDto, req.user.id);
      }

      @Get()
      findAll(
            @Query('page') page: string = '1',
            @Query('limit') limit: string = '10',
            @Query('status') status?: CampaignStatus,
      ) {
            return this.campaignsService.findAll(+page, +limit, status);
      }

      @Get('active')
      findActive() {
            return this.campaignsService.findActive();
      }

      @Get('my-campaigns')
      getMyCampaigns(@Request() req) {
            return this.campaignsService.getMyCampaigns(req.user.id);
      }

      @Get(':id')
      findOne(@Param('id') id: string) {
            return this.campaignsService.findOne(id);
      }

      @Get(':id/stats')
      @UseGuards(RolesGuard)
      @Roles(UserRole.SUPER_ADMIN)
      getCampaignStats(@Param('id') id: string) {
            return this.campaignsService.getCampaignStats(id);
      }

      @Patch(':id')
      @UseGuards(RolesGuard)
      @Roles(UserRole.SUPER_ADMIN)
      update(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto, @Request() req) {
            return this.campaignsService.update(id, updateCampaignDto, req.user.id);
      }

      @Delete(':id')
      @UseGuards(RolesGuard)
      @Roles(UserRole.SUPER_ADMIN)
      remove(@Param('id') id: string, @Request() req) {
            return this.campaignsService.remove(id, req.user.id);
      }
}