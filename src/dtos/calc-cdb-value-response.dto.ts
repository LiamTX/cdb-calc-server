import { ApiProperty } from "@nestjs/swagger";

export class CalcCdbValueResponse {
    @ApiProperty()
    date: string;

    @ApiProperty()
    unitPrice: number;
}