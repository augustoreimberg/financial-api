import type { Wallet } from "../../entities/wallet.entity"

export interface IWalletRepository {
  create(wallet: Partial<Wallet>): Promise<Wallet>
  findById(id: string): Promise<Wallet | null>
  findByUserId(userId: string): Promise<Wallet | null>
  update(id: string, data: Partial<Wallet>): Promise<Wallet>
}
