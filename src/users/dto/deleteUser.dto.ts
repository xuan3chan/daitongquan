import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate,MinLength, IsEmail, IsNotEmpty, IsString, MaxLength,Matches } from "class-validator";



export class DeleteUserDto {
    

    @ApiProperty({
        description: 'Id of user ',
        example: '60e1d0b5d8f1f40015e4e8b0'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(40)
    _id: string;
}