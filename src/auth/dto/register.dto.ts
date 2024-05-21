import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate,MinLength, IsEmail, IsNotEmpty, IsString, MaxLength,Matches } from "class-validator";

export class RegisterDto {
    

    @ApiProperty({
        description: 'Full name of user ',
        example: 'xuanchimto'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    username: string;

    @ApiProperty({
        description: 'firstname of user',
        example: 'Nguyên Lê Minh'
    })
    @IsString()
    @IsNotEmpty()
    firstname: string;

    @ApiProperty({
        description: 'Full name of user ',
        example: 'Xuân'
    })
    @IsString()
    @IsNotEmpty()
    lastname: string;

    @ApiProperty({
        description: 'Email of user ',
        example: 'xuanchimto@gmail.com'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @IsEmail({},{message:'please enter correct email'})
    email: string;

    @ApiProperty({
        description: 'Password of user ',
        example: 'Xuanchimto123'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(80)
    @MinLength(6,{message:'Password must be at least 6 characters'})
    password: string;



}