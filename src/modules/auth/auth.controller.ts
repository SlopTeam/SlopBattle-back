import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  googleLogin(): void {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(
    @Req() req: Request & { user: User },
    @Res() res: Response,
  ): Promise<void> {
    const { access_token } = await this.auth.login(req.user);
    const callbackUrl = new URL(
      '/auth/callback',
      this.config.getOrThrow<string>('FRONT_URL'),
    );
    callbackUrl.hash = `access_token=${encodeURIComponent(access_token)}`;
    res.redirect(callbackUrl.toString());
  }
}