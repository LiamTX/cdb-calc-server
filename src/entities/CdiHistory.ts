import { prop } from "@typegoose/typegoose";

export class CdiHistory {
    _id?: string;

    @prop()
    sSecurityName: string;

    @prop()
    dtDate: Date;

    @prop()
    dLastTradePrice: number;

    @prop()
    createdAt: Date;

    @prop()
    updatedAt: Date;
}