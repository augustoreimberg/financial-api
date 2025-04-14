import { Injectable } from "@nestjs/common"
import type { IUserRepository } from "../../../domain/interfaces/repositories/user-repository.interface"
import type { IWalletRepository } from "../../../domain/interfaces/repositories/wallet-repository.interface"
import type { CreateUserDto, UserResponseDto } from "../../../domain/dtos/user.dto"
import type { User } from "../../../domain/entities/user.entity"
import * as bcrypt from "bcrypt"
import { ConflictException } from "@nestjs/common"

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly walletRepository: IWalletRepository,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(createUserDto.email)
    if (existingUser) {
      throw new ConflictException("User with this email already exists")
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)

    // Create user
    const user = await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    })

    // Create wallet for user
    await this.walletRepository.create({
      userId: user.id,
      balance: 0,
    })

    // Return user without password
    return this.mapToUserResponse(user)
  }

  private mapToUserResponse(user: User): UserResponseDto {
    const { id, name, email, createdAt } = user
    return { id, name, email, createdAt }
  }
}
