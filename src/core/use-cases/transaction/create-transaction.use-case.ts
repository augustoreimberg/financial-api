import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import type { ITransactionRepository } from "../../../domain/interfaces/repositories/transaction-repository.interface"
import type { IWalletRepository } from "../../../domain/interfaces/repositories/wallet-repository.interface"
import type { IUserRepository } from "../../../domain/interfaces/repositories/user-repository.interface"
import type { CreateTransactionDto, TransactionResponseDto } from "../../../domain/dtos/transaction.dto"
import { type Transaction, TransactionStatus, TransactionType } from "../../../domain/entities/transaction.entity"
import type { DataSource } from "typeorm"

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly walletRepository: IWalletRepository,
    private readonly userRepository: IUserRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(userId: string, dto: CreateTransactionDto): Promise<TransactionResponseDto> {
    // Get sender wallet
    const senderWallet = await this.walletRepository.findByUserId(userId)
    if (!senderWallet) {
      throw new NotFoundException("Sender wallet not found")
    }

    // Get receiver
    const receiver = await this.userRepository.findById(dto.receiverId)
    if (!receiver) {
      throw new NotFoundException("Receiver not found")
    }

    // Get receiver wallet
    const receiverWallet = await this.walletRepository.findByUserId(receiver.id)
    if (!receiverWallet) {
      throw new NotFoundException("Receiver wallet not found")
    }

    // Check if sender has enough balance
    if (senderWallet.balance < dto.amount) {
      throw new BadRequestException("Insufficient balance")
    }

    // Start transaction
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      // Create transaction record
      const transaction = await this.transactionRepository.create({
        amount: dto.amount,
        description: dto.description,
        senderWalletId: senderWallet.id,
        receiverWalletId: receiverWallet.id,
        status: TransactionStatus.PENDING,
        type: TransactionType.TRANSFER,
      })

      // Update sender wallet balance
      await this.walletRepository.update(senderWallet.id, {
        balance: senderWallet.balance - dto.amount,
      })

      // Update receiver wallet balance
      await this.walletRepository.update(receiverWallet.id, {
        balance: receiverWallet.balance + dto.amount,
      })

      // Update transaction status to completed
      const updatedTransaction = await this.transactionRepository.update(transaction.id, {
        status: TransactionStatus.COMPLETED,
      })

      await queryRunner.commitTransaction()

      return this.mapToTransactionResponse(updatedTransaction)
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  private mapToTransactionResponse(transaction: Transaction): TransactionResponseDto {
    const {
      id,
      amount,
      status,
      type,
      description,
      senderWalletId,
      receiverWalletId,
      createdAt,
      originalTransactionId,
    } = transaction

    return {
      id,
      amount,
      status,
      type,
      description,
      senderWalletId,
      receiverWalletId,
      createdAt,
      originalTransactionId,
    }
  }
}
