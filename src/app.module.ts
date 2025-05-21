import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI!),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (ConfigService: ConfigService): any => {
    //     // console.log(ConfigService);
    //     // return '';
    //     const dbUri = ConfigService.get<string>('DB_URI');
    //     if( !dbUri ){
    //       throw new Error('DB_URI environment variable is not defined');
    //     }
    //     return  { uri: dbUri };
    //   },
    //   inject: [ConfigService],
    // }),
    BookModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
