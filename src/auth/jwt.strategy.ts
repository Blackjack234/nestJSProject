import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from './schemas/user.schemas';
import { Model } from 'mongoose';

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload) {
    try {
      const { id } = payload;
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new UnauthorizedException('Please login first to get access.');
      }
      return user;
    } catch (e) {
      if (e instanceof UnauthorizedException) throw e;
      throw new InternalServerErrorException(`Failed to login: ${e?.message}`);
    }
  }
}
