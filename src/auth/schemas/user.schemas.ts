import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}
@Schema({
  timestamps: true,
  versionKey: false,
})
export class User extends Document {
  @Prop({ required: [true, 'Name is required.'] })
  name: string;

  @Prop({ unique: [true, 'OOps!! Duplicate email entered.'] })
  email: string;

  @Prop({ enum: Gender })
  gender: string;

  @Prop()
  address: string;

  @Prop()
  password: string;
}

export const USerSchema = SchemaFactory.createForClass(User);
