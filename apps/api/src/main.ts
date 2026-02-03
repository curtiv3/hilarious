import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import pinoHttp from "pino-http";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.use(pinoHttp());
  app.setGlobalPrefix("v1");
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:3000" });
  await app.listen(4000);
}

bootstrap();
