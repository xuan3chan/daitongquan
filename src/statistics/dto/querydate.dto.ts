import { ApiProperty } from "@nestjs/swagger";

export class QueryDto{
    @ApiProperty(
        {
            type: Date,
            description: 'Start date',
            example: '2021-01-01',
            required: true
        }
    )
    start: Date;
    @ApiProperty(
        {
            type: Date,
            description: 'End date',
            example: '2021-01-01',
            required: true
        }
    )
    end: Date;
}