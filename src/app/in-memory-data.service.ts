import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  createDb() {
    const products = [
      { id: 11, name: 'Runner Max', brand: 'Nike', type: 'Run' },
      { id: 12, name: 'test', brand: 'test', type: 'test' },
      { id: 13, name: 'test', brand: 'test', type: 'test' },
      { id: 14, name: 'test', brand: 'test', type: 'test' },
    ];

    const users = [
      { id: 21, name: 'Pedro'},
      { id: 22, name: 'Juan'},
      { id: 23, name: 'Ana'},
      { id: 24, name: 'Liz'},
    ];

    return { products, users };
  }
}
