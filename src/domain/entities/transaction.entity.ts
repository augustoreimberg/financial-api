import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Wallet } from "./wallet.entity"

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REVERSED = "reversed",
}

export enum TransactionType {
  TRANSFER = "transfer",
  REVERSAL = "reversal",
}

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number

  @Column({
    type: "enum",
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus

  @Column({
    type: "enum",
    enum: TransactionType,
    default: TransactionType.TRANSFER,
  })
  type: TransactionType

  @Column({ nullable: true })
  description: string

  @Column({ nullable: true })
  originalTransactionId: string

  @ManyToOne(
    () => Wallet,
    (wallet) => wallet.sentTransactions,
  )
  senderWallet: Wallet

  @Column()
  senderWalletId: string

  @ManyToOne(
    () => Wallet,
    (wallet) => wallet.receivedTransactions,
  )
  receiverWallet: Wallet

  @Column()
  receiverWalletId: string

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date
}
