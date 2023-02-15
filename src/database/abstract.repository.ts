import { Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  FilterQuery,
  Model,
  Types,
  UpdateQuery,
  SaveOptions,
  Connection,
} from 'mongoose';
import { AbstractDocument } from './abstract.schema';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(
    protected readonly model: Model<TDocument>,
    private readonly connection: Connection,
  ) {}

  create = async (
    document: Omit<TDocument, '_id' | 'entityId'>,
    options?: SaveOptions,
  ): Promise<TDocument> => {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
      entityId: uuidv4().replace(/-/g, ''),
    });
    return (
      await createdDocument.save(options)
    ).toJSON() as unknown as TDocument;
  };

  findOne = async (filterQuery: FilterQuery<TDocument>): Promise<TDocument> => {
    const document = await this.model.findOne(
      filterQuery,
      { _id: 0, password: 0 },
      { lean: true },
    );

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      return null;
    }

    return document;
  };

  findOneAndUpdate = async (
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> => {
    const document = await this.model.findOneAndUpdate(
      filterQuery,
      { $set: update },
      {
        lean: true,
        new: true,
        runValidators: true,
        projection: { _id: 0, password: 0 },
      },
    );

    if (!document) {
      this.logger.warn(`Document not found with filterQuery:`, filterQuery);
      return null;
    }

    return document;
  };

  updateOne = async (
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ) => {
    return await this.model.updateOne(
      filterQuery,
      { $set: update },
      {
        lean: true,
        new: true,
        runValidators: true,
        projection: { _id: 0, password: 0 },
      },
    );
  };

  upsert = async (
    filterQuery: FilterQuery<TDocument>,
    document: Partial<TDocument>,
  ) => {
    return this.model.findOneAndUpdate(filterQuery, document, {
      lean: true,
      upsert: true,
      new: true,
    });
  };

  find = async (filterQuery: FilterQuery<TDocument>) => {
    return this.model.find(
      filterQuery,
      { _id: 0, password: 0 },
      { lean: true },
    );
  };

  deleteOne = async (filterQuery: FilterQuery<TDocument>) => {
    return await this.model.deleteOne(filterQuery);
  };

  startTransaction = async () => {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  };
}
