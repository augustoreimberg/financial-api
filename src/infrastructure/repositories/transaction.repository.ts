import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Transaction } from "../../domain/entities/transaction.entity"
import type { ITransactionRepository } from "../../domain/interfaces/repositories/transaction-repository.interface"
import { Wallet } from "../../domain/entities/wallet.entity"

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async create(transaction: Partial<Transaction>): Promise<Transaction> {
    const newTransaction = this.transactionRepository.create(transaction)
    return this.transactionRepository.save(newTransaction)
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.transactionRepository.findOne({ where: { id } })
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    const wallet = await this.walletRepository.findOne({ where: { userId } })
    if (!wallet) {
      return []
    }

    return this.transactionRepository.find({
      where: [{ senderWalletId: wallet.id }, { receiverWalletId: wallet.id }],
      order: { createdAt: "DESC" },
    })
  }

  async update(id: string, data: Partial<Transaction>): Promise<Transaction> {
    await this.transactionRepository.update(id, data)
    return this.findById(id)
  }

  async findByOriginalTransactionId(originalTransactionId: string): Promise<Transaction | null> {
    return this.transactionRepository.findOne({ where: { originalTransactionId } })
  }
}
