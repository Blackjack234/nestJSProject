import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './schemas/user.schemas';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(SignUpDto: SignUpDto): Promise<string> {
    try {
      const { name, email, gender, address, password } = SignUpDto;
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.userModel.create({
        name,
        email,
        gender,
        address,
        password: hashedPassword,
      });

      const token = this.jwtService.sign({ id: user._id });

      return token;
    } catch (error) {
      throw new Error(`Failed to fetch books: ${error.message}`);
    }
  }

  async login(loginDto: LoginDto): Promise<string> {
    try {
      const { email, password } = loginDto;

      const user = await this.userModel.findOne({ email });

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordMatched = await bcrypt.compare(password, user.password);

      if (!isPasswordMatched) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const token = this.jwtService.sign({ id: user._id });

      return token;
    } catch (e) {
      throw new Error(`Failed to login : ${e?.message}`);
    }
  }
}
