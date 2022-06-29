import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

const logger = new Logger('redis');

const microserviceOptions = {
  transport: Transport.REDIS,
  option: {
    url: process.env.REDIS_URL
  }
}

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AppModule, microserviceOptions
  );
  app.listen(() => {
    logger.log('Redis started');
  });
}
bootstrap();
