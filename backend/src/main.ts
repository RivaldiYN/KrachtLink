import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";

async function bootstrap() {
      const app = await NestFactory.create<NestExpressApplication>(AppModule);
      const configService = app.get(ConfigService);

      // Global prefix
      app.setGlobalPrefix("api");

      // CORS configuration
      app.enableCors({
            origin: [
                  configService.get("FRONTEND_URL"),
                  "http://localhost:3000",
                  "https://krachtlink.com",
            ],
            credentials: true,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"],
      });

      // Global pipes
      app.useGlobalPipes(
            new ValidationPipe({
                  transform: true,
                  whitelist: true,
                  forbidNonWhitelisted: true,
            })
      );

      // Global filters
      app.useGlobalFilters(new HttpExceptionFilter());

      // Global interceptors
      app.useGlobalInterceptors(new LoggingInterceptor());

      // Static files
      app.useStaticAssets(join(__dirname, "..", "uploads"), {
            prefix: "/uploads/",
      });

      const port = configService.get("APP_PORT") || 3001;
      await app.listen(port);

      console.log(`🚀 KrachtLink Backend running on: http://localhost:${port}`);
      console.log(`📚 API Documentation: http://localhost:${port}/api`);
}

bootstrap();
