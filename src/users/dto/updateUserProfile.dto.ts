import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, MinLength, IsEmail, IsString, MaxLength, IsOptional } from "class-validator";

export class UpdateUserProfileDto {
    @ApiProperty({
        description: 'Full name of user ',
        example: 'Nguyen Le Minh Xuan'
    })
    @IsString()
    @MaxLength(100)
    @MinLength(6,{message:'Full name must be at least 6 characters'})
    @IsOptional()
    fullName?: string;

    @ApiProperty({
        description: 'Email of user ',
        example: 'xuancudai2km@gmail.com'
    })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({
        description: 'Date of birth of user ',
        example: '1999-12-31'
    })
    @IsDate()
    @Transform(({ value }) => new Date(value))
    @IsOptional()
    dateOfBirth?: Date;
    
    @ApiProperty({
        description: 'Email of user ',
        example: 'Duong Quan Ham, Phuong 5, Quan 6, TP.HCM'
    })
    @IsString()
    @MaxLength(150)
    @IsOptional()
    address?: string;

    @ApiProperty({
        description:'male or female or other',
        example:'male'
    })
    @IsOptional()
    gender?: string;
}