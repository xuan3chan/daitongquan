import { ApiProperty } from "@nestjs/swagger";
import { IsDate,MinLength, IsEmail, IsNotEmpty, IsString, MaxLength,Matches, IsNumber, ArrayNotEmpty, IsArray, ArrayMinSize } from "class-validator";

export class DeleteRoleDto {


    @ApiProperty({
        description: 'role_id of role',
        example: '5f2a5c1b4f9d550017c3d4d7'
    })
    @IsString()
    @IsNotEmpty()
    id: string;
}