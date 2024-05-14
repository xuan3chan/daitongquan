import { ApiProperty } from "@nestjs/swagger";  
import { IsDate,MinLength, IsEmail, IsNotEmpty, IsString, MaxLength,Matches } from "class-validator";

export class LoginDto {
    
    @ApiProperty({
        description: 'Email of user or username',
        example: 'xuanchimto@gmail.com'
    })
    @IsString()
    account: string;

    @ApiProperty({
        description: 'Username of user ',
        example: 'Xuanchimto123'
    })
    @IsString()
    @IsNotEmpty({message:'Password is required'})
    @MaxLength(80)
    
    password: string;

   
}