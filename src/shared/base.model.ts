import { Schema, Types } from 'mongoose';
import { buildSchema, modelOptions, prop, Severity } from '@typegoose/typegoose';
import { ApiHideProperty } from '@nestjs/swagger';


export abstract class BaseModel {
  @prop()
  @ApiHideProperty()
  createdAt?: Date; // provided by timestamps
  @prop()
  @ApiHideProperty()
  updatedAt?: Date;
  // add more to a base model if you want.

  static get schema(): Schema {
    return buildSchema(this as any, {
      timestamps: true,
      toJSON: {
        getters: true,
        virtuals: true,
      },
    });
  }

  static get modelName(): string {
    return this.name;
  }
}