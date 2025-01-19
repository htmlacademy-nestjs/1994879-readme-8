import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export async function validateConfig<T extends object>(
  config: object,
  cls: new () => T,
  message: string = `${cls.name} validation failed!`
) {
  const validatedConfig = plainToClass(cls, config);
  const errors = await validate(validatedConfig);

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => Object.values(error.constraints).join('\n'))
      .join('\n');
    throw new Error(`${message}\n${errorMessages}.\n`);
  }
  return validatedConfig;
}
