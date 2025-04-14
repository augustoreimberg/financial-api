import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class CreateUserDto {
  @ApiProperty({ example: "John Doe" })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ example: "john@example.com" })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({ example: "password123" })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string
}

export class UserResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  email: string

  @ApiProperty()
  createdAt: Date
}
