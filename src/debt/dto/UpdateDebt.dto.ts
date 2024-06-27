import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional, IsDateString, Min } from "class-validator";

export class UpdateDebtDto {
  @ApiProperty({ example: 'John Doe', description: 'Name of the debtor' })
  @IsString()

  @IsOptional()
  debtor: string;

  @ApiProperty({ example: 'Jane Doe', description: 'Name of the creditor' })
  @IsString()

  @IsOptional()
  creditor: string;

  @ApiProperty({ example: 1000, description: 'Amount of the debt' })
  @IsNumber()

  @Min(1)
  @IsOptional()
  amount: number;

  @ApiProperty({ example: 'Loan for car', description: 'Description of the debt' })
  @IsString()
 
  @IsOptional()
  description: string;

 
  @ApiProperty({ example: 'active', enum: ['active', 'paid', 'overdue'], description: 'Status of the debt' })
  @IsString()

  @IsOptional() 
  @IsEnum(['active', 'paid', 'overdue'])
  status: string;

  @ApiProperty({ example: 'lending_debt or borrowing_debt', enum: ['lending_debt', 'borrowing_debt'], description: 'Type of the debt' })
  @IsString()

  @IsOptional()
  @IsEnum(['lending_debt', 'borrowing_debt'])
  type: string;

  @ApiProperty({ example: '2024-12-31', description: 'Due date of the debt', required: false })
  @IsDateString()
  @IsOptional()
  dueDate: Date;
}
