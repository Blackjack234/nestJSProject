import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schemas/book.schemas';
import * as mongoose from 'mongoose';
import { CreateBookDto } from './dto/create_book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Query } from 'express-serve-static-core';
import { User } from '../auth/schemas/user.schemas';
@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: mongoose.Model<Book>,
  ) {}

  async findAll(query: Query): Promise<Book[] | null> {
    try {
      console.log(query);

      const resPerPage = 2;
      const currentPage = Number(query.page) || 1;
      const skip = resPerPage * (currentPage - 1);
      const keyword = query.keyword
        ? {
            title: {
              $regex: query.keyword,
              $options: 'i',
            },
          }
        : {};

      const result = await this.bookModel
        .find({ ...keyword })
        .limit(resPerPage)
        .skip(skip)
        .exec();
      if (!result) {
        return null;
      }
      return result;
    } catch (e) {
      throw new Error(`Failed to fetch books: ${e.message}`);
    }
  }

  async create(book: CreateBookDto, user: User): Promise<Book | null> {
    try {
      const data = Object.assign(book, { user: user._id });
      const res = await this.bookModel.create(data);
      if (!res) {
        return null;
      }

      return res;
    } catch (error) {
      throw new Error(`somthing went wrong ${error?.message}`);
    }
  }

  async findById(id: string): Promise<Book | null | Error> {
    try {
      const isValidate = mongoose.isValidObjectId(id);

      if (!isValidate) {
        throw new BadRequestException('Please enter correct id.');
      }
      const book = await this.bookModel.findById({ _id: id });

      if (!book) {
        return null;
      }

      return book;
    } catch (error) {
      throw new Error(`something went wrong ${error?.message}`);
    }
  }

  async updateById(id: string, book: UpdateBookDto): Promise<Book | null> {
    try {
      const result = await this.bookModel.findByIdAndUpdate({ _id: id }, book, {
        new: true,
        runValidators: true,
      });

      if (!result) {
        return null;
      }

      return result;
    } catch (error) {
      throw new Error(`somthing went wrong ${error?.message}`);
    }
  }

  async deleteBookById(id: string): Promise<Book | Error | null> {
    try {
      const result = await this.bookModel.findByIdAndDelete({ _id: id });
      if (!result) {
        return null;
      }
      return result;
    } catch (error) {
      throw new HttpException(
        `something went wrong, ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
