import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    // const app = await NestFactory.create(AppModule);

    // const config = new DocumentBuilder()
    //     .setTitle('Cats example')
    //     .setDescription('The cats API description')
    //     .setVersion('1.0')
    //     .addTag('cats')
    //     .build();
    // const document = SwaggerModule.createDocument(app, config);
    // SwaggerModule.setup('api', app, document);

    // await app.listen(3001);
    const app = await NestFactory.createMicroservice(
        AppModule,
        {
            transport: Transport.RMQ,
            options: {
                urls: ['amqp://rabbitmq:5672'],
                queue: 'transactions_queue',
                queueOptions: {
                    durable: false
                },
            },
        },
    );
    app.listen();
}
bootstrap();
