import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate,MinLength, IsEmail, IsNotEmpty, IsString, MaxLength,Matches } from "class-validator";

export class CreateUserDto {
    
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

    @ApiProperty({
        description: 'Full name of user ',
        example: 'Nguyen Le Minh Xuan'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    fullname: string;

    @ApiProperty({
        description: 'Date of birth of user ',
        example: '1999-12-31'
    })
    @IsDate()
    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    dateOfBirth: Date;

    @ApiProperty({
        description: 'Avatar of user ',
        example: 'https://thumbs.dreamstime.com/b/default-profile-picture-avatar-photo-placeholder-vector-illustration-default-profile-picture-avatar-photo-placeholder-vector-189495158.jpg'
    })
    @IsString()
    avatar: string;

    @ApiProperty({
        description: 'Address of user ',
        example: 'Ho Chi Minh City'
    })
    @IsString()
    @MaxLength(150)
    address: string;
    
   
    refreshToken: string;


}