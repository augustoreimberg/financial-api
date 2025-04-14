import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import type { CreateTransactionUseCase } from "../../core/use-cases/transaction/create-transaction.use-case"
import type { GetTransactionsUseCase } from "../../core/use-cases/transaction/get-transactions.use-case"
import type { ReverseTransactionUseCase } from "../../core/use-cases/transaction/reverse-transaction.use-case"
import {
  type CreateTransactionDto,
  type ReverseTransactionDto,
  TransactionResponseDto,
} from "../../domain/dtos/transaction.dto"
import { JwtAuthGuard } from "../guards/jwt-auth.guard"
import { User } from "../decorators/user.decorator"

@ApiTags("transactions")
@Controller("transactions")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly reverseTransactionUseCase: ReverseTransactionUseCase,
    private readonly getTransactionsUseCase: GetTransactionsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: "Create a new transaction" })
  @ApiResponse({ status: 201, description: "Transaction created successfully", type: TransactionResponseDto })
  @ApiResponse({ status: 400, description: "Insufficient balance" })
  @ApiResponse({ status: 404, description: "Wallet or receiver not found" })
  async create(
    @User('id') userId: string,
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    return this.createTransactionUseCase.execute(userId, createTransactionDto)
  }

  @Post("reverse")
  @ApiOperation({ summary: "Reverse a transaction" })
  @ApiResponse({ status: 201, description: "Transaction reversed successfully", type: TransactionResponseDto })
  @ApiResponse({ status: 400, description: "Transaction cannot be reversed" })
  @ApiResponse({ status: 404, description: "Transaction not found" })
  async reverse(
    @User('id') userId: string,
    @Body() reverseTransactionDto: ReverseTransactionDto,
  ): Promise<TransactionResponseDto> {
    return this.reverseTransactionUseCase.execute(userId, reverseTransactionDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get user transactions' })
  @ApiResponse({ status: 200, description: 'Transactions retrieved successfully', type: [TransactionResponseDto] })
  async getTransactions(@User('id') userId: string): Promise<TransactionResponseDto[]> {
    return this.getTransactionsUseCase.execute(userId);
  }
}
