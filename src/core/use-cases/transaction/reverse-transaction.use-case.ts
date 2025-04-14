import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import type { ITransactionRepository } from "../../../domain/interfaces/repositories/transaction-repository.interface"
import type { IWalletRepository } from "../../../domain/interfaces/repositories/wallet-repository.interface"
import type { ReverseTransactionDto, TransactionResponseDto } from "../../../domain/dtos/transaction.dto"
import { type Transaction, TransactionStatus, TransactionType } from "../../../domain/entities/transaction.entity"
import type { DataSource } from "typeorm"

@Injectable()
export class ReverseTransactionUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly walletRepository: IWalletRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(userId: string, dto: ReverseTransactionDto): Promise<TransactionResponseDto> {
    // Get the original transaction
    const originalTransaction = await this.transactionRepository.findById(dto.transactionId)
    if (!originalTransaction) {
      throw new NotFoundException("Transaction not found")
    }

    // Check if transaction is already reversed
    if (originalTransaction.status === TransactionStatus.REVERSED) {
      throw new BadRequestException("Transaction is already reversed")
    }

    // Check if transaction is completed
    if (originalTransaction.status !== TransactionStatus.COMPLETED) {
      throw new BadRequestException("Only completed transactions can be reversed")
    }

    // Check if the user is the sender of the transaction
    const senderWallet = await this.walletRepository.findById(originalTransaction.senderWalletId)
    if (!senderWallet || senderWallet.userId !== userId) {
      throw new BadRequestException("You can only reverse transactions you initiated")
    }

    // Check if there's already a reversal for this transaction
    const existingReversal = await this.transactionRepository.findByOriginalTransactionId(originalTransaction.id)
    if (existingReversal) {
      throw new BadRequestException("This transaction has already been reversed")
    }

    // Get receiver wallet
    const receiverWallet = await this.walletRepository.findById(originalTransaction.receiverWalletId)
    if (!receiverWallet) {
      throw new NotFoundException("Receiver wallet not found")
    }

    // Check if receiver has enough balance for the reversal
    if (receiverWallet.balance < originalTransaction.amount) {
      throw new BadRequestException("Receiver has insufficient balance for reversal")
    }

    // Start transaction
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      // Create reversal transaction
      const reversalTransaction = await this.transactionRepository.create({
        amount: originalTransaction.amount,
        description: dto.reason || `Reversal of transaction ${originalTransaction.id}`,
        senderWalletId: originalTransaction.receiverWalletId, // Reversed: receiver is now sender
        receiverWalletId: originalTransaction.senderWalletId, // Reversed: sender is now receiver
        status: TransactionStatus.PENDING,
        type: TransactionType.REVERSAL,
        originalTransactionId: originalTransaction.id,
      })

      // Update receiver wallet balance (deduct the amount)
      await this.walletRepository.update(receiverWallet.id, {
        balance: receiverWallet.balance - originalTransaction.amount,
      })

      // Update sender wallet balance (add the amount back)
      await this.walletRepository.update(senderWallet.id, {
        balance: senderWallet.balance + originalTransaction.amount,
      })

      // Mark original transaction as reversed
      await this.transactionRepository.update(originalTransaction.id, {
        status: TransactionStatus.REVERSED,
      })

      // Update reversal transaction status to completed
      const updatedReversal = await this.transactionRepository.update(reversalTransaction.id, {
        status: TransactionStatus.COMPLETED,
      })

      await queryRunner.commitTransaction()

      return this.mapToTransactionResponse(updatedReversal)
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
