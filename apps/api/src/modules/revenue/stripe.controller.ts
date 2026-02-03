import { Controller, Post, Req } from "@nestjs/common";
import type { Request } from "express";

@Controller("integrations/stripe")
export class StripeWebhookController {
  @Post("webhook")
  async webhook(@Req() req: Request) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (secret) {
      const signature = req.headers["stripe-signature"] as string | undefined;
      if (!signature) {
        return { received: false };
      }
    }
    return { received: true };
  }
}
