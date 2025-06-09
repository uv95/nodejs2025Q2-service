import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsStringOrNull(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsStringOrNull',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' || value === null;
        },
      },
    });
  };
}
