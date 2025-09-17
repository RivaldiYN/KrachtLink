import {
      Controller,
      Get,
      Post,
      Body,
      Patch,
      Param,
      Query,
      UseGuards,
      Request,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { TransactionType, TransactionStatus } from './entities/transaction.entity';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
      constructor(private readonly transactionsService: TransactionsService) { }

      @Post()
      @UseGuards(RolesGuard)
      @Roles(UserRole.SUPER_ADMIN)
      create(@Body() createTransactionDto: CreateTransactionDto) {
            return this.transactionsService.createTransaction(createTransactionDto);
      }

      @Get()
      @UseGuards(RolesGuard)
      @Roles(UserRole.SUPER_ADMIN)
      findAll(
            @Query('page') page: string = '1',
            @Query('limit') limit: string = '10',
            @Query('type') type?: TransactionType,
            @Query('status') status?: TransactionStatus,
      ) {
            return this.transactionsService.findAll(+page, +limit, type, status);
      }

      @Get('my-transactions')
      getMyTransactions(
            @Request() req,
            @Query('page') page: string = '1',
            @Query('limit') limit: string = '10',
      ) {
            return this.transactionsService.findUserTransactions(req.user.id, +page, +limit);
      }

      @Get('wallet')
      getWallet(@Request() req) {
            return this.transactionsService.getUserWallet(req.user.id);
      }

      @Get('stats')
      @UseGuards(RolesGuard)
      @Roles(UserRole.SUPER_ADMIN)
      getStats() {
            return this.transactionsService.getFinancialStats();
      }

      @Post('withdraw')
      requestWithdraw(@Request() req, @Body() withdrawDto: WithdrawDto) {
            return this.transactionsService.requestWithdraw(req.user.id, withdrawDto);
      }

      @Patch(':id/process')
      @UseGuards(RolesGuard)
      @Roles(UserRole.SUPER_ADMIN)
      processWithdraw(
            @Param('id') id: string,
            @Body('status') status: TransactionStatus,
      ) {
            return this.transactionsService.processWithdraw(id, status);
      }
}