import { InternalServerErrorException } from '@nestjs/common';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';
import { MongoError } from 'mongodb';
import { DocumentQuery, Types, Query } from 'mongoose';
import { BaseModel } from './base.model';

type QueryList<T extends BaseModel> = DocumentQuery<
  Array<DocumentType<T>>,
  DocumentType<T>
>;
type QueryItem<T extends BaseModel> = DocumentQuery<
  DocumentType<T>,
  DocumentType<T>
>;

export abstract class BaseService<T extends BaseModel> {
  protected model: ReturnModelType<AnyParamConstructor<T>>;

  protected constructor(model: ReturnModelType<AnyParamConstructor<T>>) {
    this.model = model;
  }

  protected static throwMongoError(err: MongoError): void {
    throw new InternalServerErrorException(err, err.errmsg);
  }

  protected static toObjectId(id: string): Types.ObjectId {
    try {
      return Types.ObjectId(id);
    } catch (e) {
      this.throwMongoError(e);
    }
  }

  createModel(doc?: Partial<T>): T {
    return new this.model(doc);
  }

  findAll(filter = {}): QueryList<T> {
    return this.model.find(filter);
  }

  async findAllAsync(filter = {}): Promise<Array<DocumentType<T>>> {
    try {
      return await this.findAll(filter).exec();
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  async findOne(filter = {}): Promise<T> {
    return this.model.findOne(filter).exec();
  }

  async findOneAsync(filter = {}): Promise<T> {
    try {
      return await this.findOne(filter);
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  async findById(id: string): Promise<T> {
    return this.findOne({ _id: Types.ObjectId(id) });
  }

  async findByIdAsync(id: string): Promise<T> {
    try {
      return await this.findById(id);
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  async create(item: any): Promise<T> {
    try {
      item["createdAt"] = new Date();
      item["updatedAt"] = new Date();
      const data = await this.model.create(item);
      return data;
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  delete(filter = {}): QueryItem<T> {
    return this.model.findOneAndDelete(filter);
  }

  async deleteAsync(filter = {}): Promise<DocumentType<T>> {
    try {
      return await this.delete(filter).exec();
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  deleteById(id: string): QueryItem<T> {
    return this.model.findByIdAndDelete(BaseService.toObjectId(id));
  }

  async deleteByIdAsync(id: string): Promise<DocumentType<T>> {
    try {
      return await this.deleteById(id).exec();
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  update(id: string, item: any): QueryItem<T> {
    item["updateAt"] = new Date();
    return this.model.findByIdAndUpdate(BaseService.toObjectId(id), item, {
      new: true,
    });
  }

  async updateAsync(id: string, item: T): Promise<DocumentType<T>> {
    try {
      return await this.update(id, item).exec();
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  count(filter = {}): Query<number> {
    return this.model.count(filter);
  }

  async countAsync(filter = {}): Promise<number> {
    try {
      return await this.count(filter);
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }
}