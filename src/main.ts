import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const logger = new Logger('Products-Main');

  console.log(envs.natsServers);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      // transport: Transport.TCP,
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers // this is  already an array
        // servers: ['nats://localhost:4222']
        // port: envs.port,

      }
    }
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // await app.listen(envs.port); because we are using microservices we don't need to listen to the port
  await app.listen();

  logger.log(`Products Microservices running on port: ${envs.port}`);
}
bootstrap();
