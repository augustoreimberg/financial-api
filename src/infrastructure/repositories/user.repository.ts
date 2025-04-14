import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { User } from "../../domain/entities/user.entity"
import type { IUserRepository } from "../../domain/interfaces/repositories/user-repository.interface"

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(user)
    return this.userRepository.save(newUser)
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } })
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } })
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    await this.userRepository.update(id, data)
    return this.findById(id)
  }
}
