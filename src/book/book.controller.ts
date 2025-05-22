import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schemas';
import { CreateBookDto } from './dto/create_book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get('all')
  async getAllBooks(@Query() query: ExpressQuery): Promise<Book[] | null> {
    try {
      return this.bookService.findAll(query);
    } catch (error: any) {
      throw new Error(`something went wrong ${error?.message}`);
    }
  }

  @Post('new')
  @UseGuards(AuthGuard())
  async createBook(
    @Body()
    book: CreateBookDto,
  ): Promise<{ message: string; data: Book } | Error> {
    try {
      const result = await this.bookService.create(book);
      if (!result) {
        return new Error(`Book not created`);
      }
      return {
        message: 'new book added successfull',
        data: result,
      };
    } catch (error) {
      throw new Error(`somthing went wrong ${error?.message}`);
    }
  }

  @Get('one/:id')
  async getByIdBook(
    @Param('id')
    id: string,
  ): Promise<Book | Error> {
    try {
      const result = await this.bookService.findById(id);

      if (!result) {
        return new Error(`Book not found`);
      }
      return result;
    } catch (error) {
      throw new Error(`Something went wrong ${error.message}`);
    }
  }

  @Put('update/:id')
  async updateById(
    @Param('id')
    id: string,
    @Body()
    book: UpdateBookDto,
  ): Promise<{ message: string; data: Book } | Error> {
    try {
      const result = await this.bookService.updateById(id, book);
      if (!result) {
        throw new Error(`somthing went wrong`);
      }

      return {
        message: 'book update successfull',
        data: result,
      };
    } catch (error) {
      throw new Error(`server error ${error?.message}`);
    }
  }

  @Delete('delete/:id')
  async deleteById(
    @Param('id')
    id: string,
  ): Promise<{ message: string } | Error> {
    try {
      const result = await this.bookService.deleteBookById(id);
      if (!result) {
        throw new NotFoundException(`Book with id ${id} not found`);
      }

      return {
        message: 'delete is successfull',
      };
    } catch (error) {
      throw new HttpException(
        `somthing went wrong , ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
