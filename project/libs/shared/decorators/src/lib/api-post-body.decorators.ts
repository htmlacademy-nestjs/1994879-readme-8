import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';

export function ApiPostBody(propName: string, ...DTOs: any[]) {
  return applyDecorators(
    ApiExtraModels(...DTOs),
    ApiBody({
      schema: {
        oneOf: DTOs.map((DTO) => ({ $ref: getSchemaPath(DTO) })),
        discriminator: {
          propertyName: propName,
          mapping: DTOs.reduce((acc, dto) => {
            acc[propName] = getSchemaPath(dto);
            return acc;
          }, {}),
        },
      },
    })
  );
}
