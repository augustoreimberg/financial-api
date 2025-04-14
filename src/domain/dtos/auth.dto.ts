import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class LoginDto {
  @ApiProperty({ example: "john@example.com" })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({ example: "password123" })
  @IsNotEmpty()
  @IsString()
  password: string
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string

  @ApiProperty()
  user: {
    id: string
    name: string
    email: string
  }
}
