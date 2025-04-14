import { Controller, Get, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import type { GetWalletUseCase } from "../../core/use-cases/wallet/get-wallet.use-case"
import { WalletResponseDto } from "../../domain/dtos/wallet.dto"
import { JwtAuthGuard } from "../guards/jwt-auth.guard"
import { User } from "../decorators/user.decorator"

@ApiTags("wallets")
@Controller("wallets")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WalletController {
  constructor(private readonly getWalletUseCase: GetWalletUseCase) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user wallet' })
  @ApiResponse({ status: 200, description: 'Wallet retrieved successfully', type: WalletResponseDto })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  async getWallet(@User('id') userId: string): Promise<WalletResponseDto> {
    return this.getWalletUseCase.execute(userId);
  }
}
