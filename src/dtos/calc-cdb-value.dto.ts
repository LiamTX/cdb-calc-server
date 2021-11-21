import { ApiProperty } from "@nestjs/swagger";

export class CalcCdbValue {
    @ApiProperty()
    investmentDate: string;

    @ApiProperty()
    cdbRate: number;

    @ApiProperty()
    currentDate: string;
}