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
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, {
      message: 'Password must contain at least one uppercase letter, one lowercase letter and one number',
    })
    password: string;

  
    
   
    refreshToken: string;


}