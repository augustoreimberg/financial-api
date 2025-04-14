import { Test, type TestingModule } from "@nestjs/testing"
import { BadRequestException, NotFoundException } from "@nestjs/common"
import { CreateTransactionUseCase } from "../../../../src/core/use-cases/transaction/create-transaction.use-case"
import { ITransactionRepository } from "../../../../src/domain/interfaces/repositories/transaction-repository.interface"
import { IWalletRepository } from "../../../../src/domain/interfaces/repositories/wallet-repository.interface"
import { IUserRepository } from "../../../../src/domain/interfaces/repositories/user-repository.interface"
import { TransactionStatus, TransactionType } from "../../../../src/domain/entities/transaction.entity"
import { DataSource, type QueryRunner } from "typeorm"

describe("CreateTransactionUseCase", () => {
  let useCase: CreateTransactionUseCase
  let transactionRepository: ITransactionRepository
  let walletRepository: IWalletRepository
  let userRepository: IUserRepository
  let dataSource: DataSource
  let queryRunner: QueryRunner

  beforeEach(async () => {
    queryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    } as unknown as QueryRunner

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTransactionUseCase,
        {
          provide: ITransactionRepository,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: IWalletRepository,
          useValue: {
            findByUserId: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: IUserRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue(queryRunner),
          },
        },
      ],
    }).compile()

    useCase = module.get<CreateTransactionUseCase>(CreateTransactionUseCase)
    transactionRepository = module.get<ITransactionRepository>(ITransactionRepository)
    walletRepository = module.get<IWalletRepository>(IWalletRepository)
    userRepository = module.get<IUserRepository>(IUserRepository)
    dataSource = module.get<DataSource>(DataSource)
  })

  it("should be defined", () => {
    expect(useCase).toBeDefined()
  })

  it("should create a transaction successfully", async () => {
    const userId = "user-123"
    const createTransactionDto = {
      receiverId: "user-456",
      amount: 100,
      description: "Test transaction",
    }

    const senderWallet = {
      id: "wallet-123",
      userId: "user-123",
      balance: 500,
    }

    const receiver = {
      id: "user-456",
      name: "Receiver",
      email: "receiver@example.com",
    }

    const receiverWallet = {
      id: "wallet-456",
      userId: "user-456",
      balance: 200,
    }

    const transaction = {
      id: "transaction-123",
      amount: 100,
      description: "Test transaction",
      senderWalletId: "wallet-123",
      receiverWalletId: "wallet-456",
      status: TransactionStatus.PENDING,
      type: TransactionType.TRANSFER,
      createdAt: new Date(),
    }

    const completedTransaction = {
      ...transaction,
      status: TransactionStatus.COMPLETED,
    }
    ;(walletRepository.findByUserId as jest.Mock).mockResolvedValueOnce(senderWallet)
    ;(userRepository.findById as jest.Mock).mockResolvedValueOnce(receiver)
    ;(walletRepository.findByUserId as jest.Mock).mockResolvedValueOnce(receiverWallet)
    ;(transactionRepository.create as jest.Mock).mockResolvedValueOnce(transaction)
    ;(transactionRepository.update as jest.Mock).mockResolvedValueOnce(completedTransaction)

    const result = await useCase.execute(userId, createTransactionDto)

    expect(walletRepository.findByUserId).toHaveBeenCalledWith(userId)
    expect(userRepository.findById).toHaveBeenCalledWith(createTransactionDto.receiverId)
    expect(walletRepository.findByUserId).toHaveBeenCalledWith(receiver.id)
    expect(transactionRepository.create).toHaveBeenCalledWith({
      amount: createTransactionDto.amount,
      description: createTransactionDto.description,
      senderWalletId: senderWallet.id,
      receiverWalletId: receiverWallet.id,
      status: TransactionStatus.PENDING,
      type: TransactionType.TRANSFER,
    })
    expect(walletRepository.update).toHaveBeenCalledWith(senderWallet.id, {
      balance: senderWallet.balance - createTransactionDto.amount,
    })
    expect(walletRepository.update).toHaveBeenCalledWith(receiverWallet.id, {
      balance: receiverWallet.balance + createTransactionDto.amount,
    })
    expect(transactionRepository.update).toHaveBeenCalledWith(transaction.id, {
      status: TransactionStatus.COMPLETED,
    })
    expect(result).toEqual({
      id: completedTransaction.id,
      amount: completedTransaction.amount,
      status: completedTransaction.status,
      type: completedTransaction.type,
      description: completedTransaction.description,
      senderWalletId: completedTransaction.senderWalletId,
      receiverWalletId: completedTransaction.receiverWalletId,
      createdAt: completedTransaction.createdAt,
    })
  })

  it("should throw BadRequestException if sender has insufficient balance", async () => {
    const userId = "user-123"
    const createTransactionDto = {
      receiverId: "user-456",
      amount: 1000,
      description: "Test transaction",
    }

    const senderWallet = {
      id: "wallet-123",
      userId: "user-123",
      balance: 500,
    }

    const receiver = {
      id: "user-456",
      name: "Receiver",
      email: "receiver@example.com",
    }

    const receiverWallet = {
      id: "wallet-456",
      userId: "user-456",
      balance: 200,
    }
    ;(walletRepository.findByUserId as jest.Mock).mockResolvedValueOnce(senderWallet)
    ;(userRepository.findById as jest.Mock).mockResolvedValueOnce(receiver)
    ;(walletRepository.findByUserId as jest.Mock).mockResolvedValueOnce(receiverWallet)

    await expect(useCase.execute(userId, createTransactionDto)).rejects.toThrow(BadRequestException)
    expect(walletRepository.findByUserId).toHaveBeenCalledWith(userId)
    expect(userRepository.findById).toHaveBeenCalledWith(createTransactionDto.receiverId)
    expect(walletRepository.findByUserId).toHaveBeenCalledWith(receiver.id)
    expect(transactionRepository.create).not.toHaveBeenCalled()
    expect(walletRepository.update).not.toHaveBeenCalled()
  })

  it("should throw NotFoundException if sender wallet not found", async () => {
    const userId = "user-123"
    const createTransactionDto = {
      receiverId: "user-456",
      amount: 100,
      description: "Test transaction",
    }
    ;(walletRepository.findByUserId as jest.Mock).mockResolvedValueOnce(null)

    await expect(useCase.execute(userId, createTransactionDto)).rejects.toThrow(NotFoundException)
    expect(walletRepository.findByUserId).toHaveBeenCalledWith(userId)
    expect(userRepository.findById).not.toHaveBeenCalled()
    expect(transactionRepository.create).not.toHaveBeenCalled()
    expect(walletRepository.update).not.toHaveBeenCalled()
  })
})
