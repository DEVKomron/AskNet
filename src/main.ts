import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";

async function start() {
  try {
    const PORT = process.env.PORT || 3030;
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors({
      origin: (origin, callback) => {
        const allowOrigins = [
          "http://localhost:8000",
          "http://localhost:3000",
          "https://AsknNet.uz",
          "https://api.AsknNet.uz",
          "https://api.AsknNet.vercel.app",
        ];
        if (!origin || allowOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new BadRequestException("Not allowed by CORS"));
        }
      },
      methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
      credentials: true,
    });
    const config = new DocumentBuilder()
      .setTitle("Ask.net")
      .setVersion("komronMirzo ")
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup("api/docs", app, document, {
      swaggerOptions: { defaultModelsExpandDepth: -1 },
    });

    await app.listen(PORT, () => {
      console.log(
        " + ====================================================================== +"
      );
      console.log(
        `| | 🚀             Server started at: http://localhost:${PORT}           🚀 | | `
      );
      console.log(
        `| | 📚  Swagger API documentation at: http://localhost:${PORT}/api/docs  📚 | |`
      );
      console.log(
        " + ====================================================================== +"
      );
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
  }
}

start();
