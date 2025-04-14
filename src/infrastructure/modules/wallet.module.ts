import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Wallet } from "../../domain/entities/wallet.entity"
import { GetWalletUseCase } from "../../core/use-cases/wallet/get-wallet.use-case"
import { WalletController } from "../controllers/wallet.controller"
import { WalletRepository } from "../repositories/wallet.repository"
import { IWalletRepository } from "../../domain/interfaces/repositories/wallet-repository.interface"

@Module({
  imports: [TypeOrmModule.forFeature([Wallet])],
  controllers: [WalletController],
  providers: [
    GetWalletUseCase,
    {
      provide: IWalletRepository,
      useClass: WalletRepository,
    },
  ],
  exports: [
    {
      provide: IWalletRepository,
      useClass: WalletRepository,
    },
  ],
})
export class WalletModule {}
