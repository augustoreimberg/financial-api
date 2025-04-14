import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./user.entity"
import { Transaction } from "./transaction.entity"

@Entity("wallets")
export class Wallet {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  balance: number

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date

  @OneToOne(
    () => User,
    (user) => user.wallet,
  )
  @JoinColumn()
  user: User

  @Column()
  userId: string

  @OneToMany(
    () => Transaction,
    (transaction) => transaction.senderWallet,
  )
  sentTransactions: Transaction[]

  @OneToMany(
    () => Transaction,
    (transaction) => transaction.receiverWallet,
  )
  receivedTransactions: Transaction[]
}
