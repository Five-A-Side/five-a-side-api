import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../database/abstract.schema';
import uniqueValidator from 'mongoose-unique-validator';

@Schema({ versionKey: false })
export class User extends AbstractDocument {
  @Prop()
  entityId: string;

  @Prop()
  name: string;

  @Prop({ unique: true })
  username: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(uniqueValidator);
