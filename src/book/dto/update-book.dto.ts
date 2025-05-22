import {
  IsEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Category } from '../schemas/book.schemas';
import { User } from '../../auth/schemas/user.schemas';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  readonly title?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsString()
  readonly author?: string;

  @IsOptional()
  @IsNumber()
  readonly price?: number;

  @IsOptional()
  @IsEnum(Category, { message: 'Please enter correct category.' })
  readonly category?: Category;

  @IsEmpty({ message: 'you cannot enter id' })
  readonly user: User;
}
