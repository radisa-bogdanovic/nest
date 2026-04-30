import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'access-secret',
    });
  }

  async validate(payload: any) {
    console.log(payload);
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
