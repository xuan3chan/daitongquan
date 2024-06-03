import { ApiProperty } from "@nestjs/swagger";  
import { IsDate,MinLength, IsEmail, IsNotEmpty, IsString, MaxLength,Matches, IsMongoId } from "class-validator";

export class BlockAdminDto {
    @ApiProperty({
        description: 'Id of the admin',
        example: '66445e3ad052f97add5912c1'
    })
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    id: string;

    @ApiProperty({
        description: 'Block status of the admin',
        example: 'true'
    })
    @IsNotEmpty()
    isBlock: boolean;
  
}