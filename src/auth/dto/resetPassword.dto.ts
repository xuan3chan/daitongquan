import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, MinLength, Matches } from 'class-validator';
export class ResetPasswordDto {

    @ApiProperty({
        description: 'Code',
        example: 'string'
    })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({
        description: 'New password',
        example: 'string'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(80)
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    newPassword: string;

}