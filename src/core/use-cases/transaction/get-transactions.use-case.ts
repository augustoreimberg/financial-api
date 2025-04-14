import { Injectable } from "@nestjs/common"
import type { ITransactionRepository } from "../../../domain/interfaces/repositories/transaction-repository.interface"
import type { IWalletRepository } from "../../../domain/interfaces/repositories/wallet-repository.interface"
import type { TransactionResponseDto } from "../../../domain/dtos/transaction.dto"
import type { Transaction } from "../../../domain/entities/transaction.entity"

@Injectable()
export class GetTransactionsUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly walletRepository: IWalletRepository,
  ) {}

  async execute(userId: string): Promise<TransactionResponseDto[]> {
    const wallet = await this.walletRepository.findByUserId(userId)
    if (!wallet) {
      return []
    }

    const transactions = await this.transactionRepository.findByUserId(userId)
    return transactions.map((transaction) => this.mapToTransactionResponse(transaction))
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
