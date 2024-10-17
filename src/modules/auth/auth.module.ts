import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./entities/user.schema";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./jwt.strategy";
import {AuthController} from "./auth.controller";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '48h' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
