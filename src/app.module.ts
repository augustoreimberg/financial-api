import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserModule } from "./infrastructure/modules/user.module"
import { AuthModule } from "./infrastructure/modules/auth.module"
import { WalletModule } from "./infrastructure/modules/wallet.module"
import { TransactionModule } from "./infrastructure/modules/transaction.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DB_HOST", "localhost"),
        port: configService.get<number>("DB_PORT", 5432),
        username: configService.get("DB_USERNAME", "postgres"),
        password: configService.get("DB_PASSWORD", "postgres"),
        database: configService.get("DB_DATABASE", "financial_wallet"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: configService.get<boolean>("DB_SYNCHRONIZE", false),
        logging: configService.get<boolean>("DB_LOGGING", false),
      }),
    }),
    UserModule,
    AuthModule,
    WalletModule,
    TransactionModule,
  ],
})
export class AppModule {}
