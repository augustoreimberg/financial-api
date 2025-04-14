import type { Transaction } from "../../entities/transaction.entity"

export interface ITransactionRepository {
  create(transaction: Partial<Transaction>): Promise<Transaction>
  findById(id: string): Promise<Transaction | null>
  findByUserId(userId: string): Promise<Transaction[]>
  update(id: string, data: Partial<Transaction>): Promise<Transaction>
  findByOriginalTransactionId(originalTransactionId: string): Promise<Transaction | null>
}
