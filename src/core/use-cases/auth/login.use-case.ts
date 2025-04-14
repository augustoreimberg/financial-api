import { Injectable, UnauthorizedException } from "@nestjs/common"
import type { JwtService } from "@nestjs/jwt"
import type { IUserRepository } from "../../../domain/interfaces/repositories/user-repository.interface"
import type { AuthResponseDto, LoginDto } from "../../../domain/dtos/auth.dto"
import * as bcrypt from "bcrypt"

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(loginDto: LoginDto): Promise<AuthResponseDto> {
    // Find user by email
    const user = await this.userRepository.findByEmail(loginDto.email)
    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials")
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email }
    const accessToken = this.jwtService.sign(payload)

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    }
  }
}
