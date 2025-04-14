import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "../../domain/entities/user.entity"
import { Wallet } from "../../domain/entities/wallet.entity"
import { CreateUserUseCase } from "../../core/use-cases/user/create-user.use-case"
import { UserController } from "../controllers/user.controller"
import { UserRepository } from "../repositories/user.repository"
import { WalletRepository } from "../repositories/wallet.repository"
import { IUserRepository } from "../../domain/interfaces/repositories/user-repository.interface"
import { IWalletRepository } from "../../domain/interfaces/repositories/wallet-repository.interface"

@Module({
  imports: [TypeOrmModule.forFeature([User, Wallet])],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    {
      provide: IWalletRepository,
      useClass: WalletRepository,
    },
  ],
  exports: [
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
  ],
})
export class UserModule {}
