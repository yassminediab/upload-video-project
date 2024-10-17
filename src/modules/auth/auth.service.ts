import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {User} from "./entities/user.schema";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService,
    ) {}

    async register(username: string, password: string): Promise<User> {
        if (!password) {
            throw new Error('Password is required');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new this.userModel({ username, password: hashedPassword });
        return user.save();
    }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userModel.findOne({ username });
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
