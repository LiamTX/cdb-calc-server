import { ApiProperty } from "@nestjs/swagger";

// Response interface
export class CalcCdbValueResponse {
    @ApiProperty()
    date: string;

    @ApiProperty()
    unitPrice: number;
}