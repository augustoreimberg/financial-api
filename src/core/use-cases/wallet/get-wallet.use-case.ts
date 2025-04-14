import { Injectable, NotFoundException } from "@nestjs/common"
import type { IWalletRepository } from "../../../domain/interfaces/repositories/wallet-repository.interface"
import type { WalletResponseDto } from "../../../domain/dtos/wallet.dto"
import type { Wallet } from "../../../domain/entities/wallet.entity"

@Injectable()
export class GetWalletUseCase {
  constructor(private readonly walletRepository: IWalletRepository) {}

  async execute(userId: string): Promise<WalletResponseDto> {
    const wallet = await this.walletRepository.findByUserId(userId)
    if (!wallet) {
      throw new NotFoundException("Wallet not found")
    }

    return this.mapToWalletResponse(wallet)
  }

  private mapToWalletResponse(wallet: Wallet): WalletResponseDto {
    const { id, balance, userId, createdAt } = wallet
    return { id, balance, userId, createdAt }
  }
}
