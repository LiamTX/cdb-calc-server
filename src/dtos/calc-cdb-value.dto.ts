import { ApiProperty } from "@nestjs/swagger";

export class CalcCdbValueRequest {
    @ApiProperty()
    investmentDate: string;

    @ApiProperty()
    cdbRate: number;

    @ApiProperty()
    currentDate: string;
}