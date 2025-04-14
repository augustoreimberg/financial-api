import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Wallet } from "./wallet.entity"

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column()
  name: string

  @Column({ default: true })
  isActive: boolean

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date

  @OneToOne(
    () => Wallet,
    (wallet) => wallet.user,
  )
  wallet: Wallet
}
