import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from "class-validator"
import { TransactionStatus, TransactionType } from "../entities/transaction.entity"

export class CreateTransactionDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsNotEmpty()
  @IsUUID()
  receiverId: string

  @ApiProperty({ example: 100.5 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number

  @ApiProperty({ example: "Payment for services", required: false })
  @IsOptional()
  @IsString()
  description?: string
}

export class ReverseTransactionDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsNotEmpty()
  @IsUUID()
  transactionId: string

  @ApiProperty({ example: "Customer requested reversal", required: false })
  @IsOptional()
  @IsString()
  reason?: string
}

export class TransactionResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  amount: number

  @ApiProperty({ enum: TransactionStatus })
  status: TransactionStatus

  @ApiProperty({ enum: TransactionType })
  type: TransactionType

  @ApiProperty()
  description: string

  @ApiProperty()
  senderWalletId: string

  @ApiProperty()
  receiverWalletId: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty({ required: false })
  originalTransactionId?: string
}
