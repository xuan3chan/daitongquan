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
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter and one number',
    })
    newPassword: string;

}