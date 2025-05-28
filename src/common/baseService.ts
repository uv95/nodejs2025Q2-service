import { BadRequestException, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { isValidUUID } from 'src/utils/validateUUID';

export class BaseService<T extends { id: string }> {
  protected items: T[] = [];

  create(data: Omit<T, 'id'>): T {
    const id = randomUUID();
    const newItem = {
      ...data,
      id,
    } as T;

    this.items.push(newItem);

    return newItem;
  }

  getAll(): T[] {
    return this.items;
  }

  findById(id: string): T {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const item = this.items.find((item) => item.id === id);

    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }

    return item;
  }

  update(id: string, data: Omit<T, 'id'>): T {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const item = this.findById(id);
    Object.assign(item, data);

    return item;
  }

  delete(id: string): void {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const itemIndex = this.items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
    this.items.splice(itemIndex, 1);
  }
}
