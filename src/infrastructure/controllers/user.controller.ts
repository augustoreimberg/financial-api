import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import type { CreateUserUseCase } from "../../core/use-cases/user/create-user.use-case"
import { type CreateUserDto, UserResponseDto } from "../../domain/dtos/user.dto"
import { JwtAuthGuard } from "../guards/jwt-auth.guard"
import { User } from "../decorators/user.decorator"

@ApiTags("users")
@Controller("users")
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: UserResponseDto })
  @ApiResponse({ status: 409, description: 'User with this email already exists' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.createUserUseCase.execute(createUserDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully', type: UserResponseDto })
  async getProfile(@User() user): Promise<UserResponseDto> {
    return user;
  }
}
