/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsLoginUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private prisma: PrismaService) {}

  async validate(login: string, _args: ValidationArguments): Promise<boolean> {
    if (typeof login !== 'string') {
      return true;
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { login },
    });

    return !existingUser;
  }
}

export function IsLoginUnique(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsLoginUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsLoginUniqueConstraint,
    });
  };
}
