import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateUserRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(10)
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
