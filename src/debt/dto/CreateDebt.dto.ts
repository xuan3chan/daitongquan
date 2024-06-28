import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, IsDate, IsDateString, IsBoolean } from 'class-validator';

export class CreateDebtDto {
  @ApiProperty({ example: 'John Doe', description: 'Name of the debtor' })
  @IsString()
  @IsNotEmpty()
  debtor: string;

  @ApiProperty({ example: 'Jane Doe', description: 'Name of the creditor' })
  @IsString()
  @IsNotEmpty()
  creditor: string;

  @ApiProperty({ example: 1000, description: 'Amount of the debt' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 'lending_debt', enum: ['lending_debt', 'borrowing_debt'], description: 'Type of the debt' })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['lending_debt', 'borrowing_debt'])
  type: string;

  @ApiProperty({ example: 'Loan for car', description: 'Description of the debt', required: false })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ example: 'active', enum: ['active', 'paid', 'overdue'], description: 'Status of the debt' })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['active', 'paid', 'overdue'])
  status: string;

  @ApiProperty({ example: '2024-12-31', description: 'Due date of the debt', required: false })
  @IsDateString()
  @IsOptional()
  dueDate: Date;

}
