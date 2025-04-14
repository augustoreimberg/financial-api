import { Test, type TestingModule } from "@nestjs/testing"
import { ConflictException } from "@nestjs/common"
import { CreateUserUseCase } from "../../../../src/core/use-cases/user/create-user.use-case"
import { IUserRepository } from "../../../../src/domain/interfaces/repositories/user-repository.interface"
import { IWalletRepository } from "../../../../src/domain/interfaces/repositories/wallet-repository.interface"
import * as bcrypt from "bcrypt"

jest.mock("bcrypt")

describe("CreateUserUseCase", () => {
  let useCase: CreateUserUseCase
  let userRepository: IUserRepository
  let walletRepository: IWalletRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: IUserRepository,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: IWalletRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile()

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase)
    userRepository = module.get<IUserRepository>(IUserRepository)
    walletRepository = module.get<IWalletRepository>(IWalletRepository)
  })

  it("should be defined", () => {
    expect(useCase).toBeDefined()
  })

  it("should create a user and wallet successfully", async () => {
    const createUserDto = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    }

    const hashedPassword = "hashed_password"
    const createdUser = {
      id: "123",
      ...createUserDto,
      password: hashedPassword,
      createdAt: new Date(),
      isActive: true,
    }
    ;(userRepository.findByEmail as jest.Mock).mockResolvedValue(null)
    ;(bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword)
    ;(userRepository.create as jest.Mock).mockResolvedValue(createdUser)
    ;(walletRepository.create as jest.Mock).mockResolvedValue({
      id: "456",
      userId: "123",
      balance: 0,
    })

    const result = await useCase.execute(createUserDto)

    expect(userRepository.findByEmail).toHaveBeenCalledWith(createUserDto.email)
    expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10)
    expect(userRepository.create).toHaveBeenCalledWith({
      ...createUserDto,
      password: hashedPassword,
    })
    expect(walletRepository.create).toHaveBeenCalledWith({
      userId: "123",
      balance: 0,
    })
    expect(result).toEqual({
      id: "123",
      name: createUserDto.name,
      email: createUserDto.email,
      createdAt: expect.any(Date),
    })
  })

  it("should throw ConflictException if user with email already exists", async () => {
    const createUserDto = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    }
    ;(userRepository.findByEmail as jest.Mock).mockResolvedValue({
      id: "123",
      email: createUserDto.email,
    })

    await expect(useCase.execute(createUserDto)).rejects.toThrow(ConflictException)
    expect(userRepository.findByEmail).toHaveBeenCalledWith(createUserDto.email)
    expect(userRepository.create).not.toHaveBeenCalled()
    expect(walletRepository.create).not.toHaveBeenCalled()
  })
})
