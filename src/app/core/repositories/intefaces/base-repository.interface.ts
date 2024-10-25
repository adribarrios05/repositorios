// src/app/core/repositories/interfaces/base-repository.interface.ts
import { Observable } from 'rxjs';
import { Model } from '../../models/base.model';
import { Paginated } from '../../models/paginated.model';

export interface IBaseRepository<T extends Model> {
  getAll(page:number, pageSize:number): Observable< T[]| Paginated<T>>;
  getById(id: string): Observable<T | null>;
  add(entity: T): Observable<T>; // Retorna el ID generado
  update(id: string, entity: T): Observable<T>;
  delete(id: string): Observable<T>;
}