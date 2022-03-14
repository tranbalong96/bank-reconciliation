import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { ENV } from '../common/constant';

@Injectable()
export class ConfigService extends NestConfigService {
    public isProductionEnv() {
        return this.get('NODE_ENV') === ENV.PRODUCTION;
    }

    public getRabbitMQUrl() {
        return this.get('RABBITMQ_URL');
    }

    public getRabbitMQPort() {
        return this.get('RABBITMQ_PORT');
    }
}