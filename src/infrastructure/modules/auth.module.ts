import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { LoginUseCase } from "../../core/use-cases/auth/login.use-case"
import { AuthController } from "../controllers/auth.controller"
import { UserModule } from "./user.module"
import { JwtStrategy } from "../strategies/jwt.strategy"

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET", "secret"),
        signOptions: { expiresIn: "1d" },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [LoginUseCase, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
