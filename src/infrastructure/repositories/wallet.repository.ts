import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Wallet } from "../../domain/entities/wallet.entity"
import type { IWalletRepository } from "../../domain/interfaces/repositories/wallet-repository.interface"

@Injectable()
export class WalletRepository implements IWalletRepository {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async create(wallet: Partial<Wallet>): Promise<Wallet> {
    const newWallet = this.walletRepository.create(wallet)
    return this.walletRepository.save(newWallet)
  }

  async findById(id: string): Promise<Wallet | null> {
    return this.walletRepository.findOne({ where: { id } })
  }

  async findByUserId(userId: string): Promise<Wallet | null> {
    return this.walletRepository.findOne({ where: { userId } })
  }

  async update(id: string, data: Partial<Wallet>): Promise<Wallet> {
    await this.walletRepository.update(id, data)
    return this.findById(id)
  }
}
