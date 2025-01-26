import { Entity, Nullable } from '@project/core';

export interface Repository<T extends Entity> {
  findById(id: T['id']): Promise<Nullable<T>>;
  save(entity: T): Promise<void>;
  update(entity: T): Promise<void>;
  deleteById(id: T['id']): Promise<void>;
}
