import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Transaction } from "../../domain/entities/transaction.entity"
import { Wallet } from "../../domain/entities/wallet.entity"
import { CreateTransactionUseCase } from "../../core/use-cases/transaction/create-transaction.use-case"
import { GetTransactionsUseCase } from "../../core/use-cases/transaction/get-transactions.use-case"
import { ReverseTransactionUseCase } from "../../core/use-cases/transaction/reverse-transaction.use-case"
import { TransactionController } from "../controllers/transaction.controller"
import { TransactionRepository } from "../repositories/transaction.repository"
import { ITransactionRepository } from "../../domain/interfaces/repositories/transaction-repository.interface"
import { UserModule } from "./user.module"
import { WalletModule } from "./wallet.module"

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Wallet]), UserModule, WalletModule],
  controllers: [TransactionController],
  providers: [
    CreateTransactionUseCase,
    ReverseTransactionUseCase,
    GetTransactionsUseCase,
    {
      provide: ITransactionRepository,
      useClass: TransactionRepository,
    },
  ],
})
export class TransactionModule {}
