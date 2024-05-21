import { ApiProperty } from "@nestjs/swagger";  
import { IsDate,MinLength, IsEmail, IsNotEmpty, IsString, MaxLength,Matches, IsMongoId } from "class-validator";

export class CreateAdminDto {
    
    @ApiProperty({
        description: 'Name of the admin',
        example: 'Admin1'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    fullname: string;

    @ApiProperty({
        description: 'Email of the admin',
        example: 'admin1@gmail.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Password of the admin',
        example: 'Admin@123'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty(
        {
            description: 'Role of the admin',
            example: '["66445e3ad052f97add5912c1","66445e3ad052f97add5912c1"]'
        }
    )
    @IsNotEmpty()
    @IsMongoId({ each: true })
    roleId: string[];
}