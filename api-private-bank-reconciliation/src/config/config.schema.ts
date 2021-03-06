import * as Joi from '@hapi/joi';

export const configSchema = {
    NODE_ENV: Joi.string()
        .valid('local', 'develop', 'production', 'test')
        .default('local'),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    RABBITMQ_URL: Joi.string().required(),
    RABBITMQ_PORT: Joi.number().required(),
};