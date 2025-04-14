import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import type { ConfigService } from "@nestjs/config"
import type { IUserRepository } from "../../domain/interfaces/repositories/user-repository.interface"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET", "secret"),
    })
  }

  async validate(payload: any) {
    const user = await this.userRepository.findById(payload.sub)
    if (!user) {
      throw new UnauthorizedException("User not found")
    }

    // Remove password from user object
    const { password, ...result } = user
    return result
  }
}
