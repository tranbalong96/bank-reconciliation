import * as Joi from '@hapi/joi';

export const configSchema = {
    NODE_ENV: Joi.string()
        .valid('local', 'develop', 'production', 'test')
        .default('local'),
    LIMIT_NUMBER: Joi.number().required(),
};