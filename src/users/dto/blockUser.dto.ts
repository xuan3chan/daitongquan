import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class BlockUserDto {
        
        @ApiProperty({
            description: 'Id of user ',
            example: '60e1d0b5d8f1f40015e4e8b0'
        })
        @IsString()
        @IsNotEmpty()
        @MaxLength(40)
        _id: string;


        @ApiProperty({
            description: 'Block status of user ',
            example: 'true'
        })
        @IsBoolean()
        @IsNotEmpty()
        isBlock: boolean;
    }