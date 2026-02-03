import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RefreshDto } from "./auth.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AuthenticatedRequest } from "../../common/tenancy/authenticated-request";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  private static attempts = new Map<string, { count: number; last: number }>();

  @Post("login")
  async login(@Body() dto: LoginDto) {
    const key = dto.email;
    const now = Date.now();
    const entry = AuthController.attempts.get(key) ?? { count: 0, last: now };
    if (now - entry.last > 15 * 60 * 1000) {
      entry.count = 0;
      entry.last = now;
    }
    entry.count += 1;
    AuthController.attempts.set(key, entry);
    if (entry.count > 10) {
      throw new HttpException("Too many login attempts, please try again later.", HttpStatus.TOO_MANY_REQUESTS);
    }
    return this.authService.login(dto.email, dto.password);
  }

  @Post("refresh")
  async refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  async logout(@Req() req: AuthenticatedRequest) {
    await this.authService.logout(req.user.id);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@Req() req: AuthenticatedRequest) {
    return { user: req.user };
  }
}
