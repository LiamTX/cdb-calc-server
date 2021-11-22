import { ApiProperty } from "@nestjs/swagger";

// Request interface
export class CalcCdbValueRequest {
    @ApiProperty()
    investmentDate: string;

    @ApiProperty()
    cdbRate: number;

    @ApiProperty()
    currentDate: string;
}