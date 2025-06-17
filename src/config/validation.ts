import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3001),
  JWT_SECRET: Joi.string().min(16).required(),
  NODE_ENV: Joi.string().valid('dev', 'prod').default('dev'),
});
