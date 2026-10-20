import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatFact } from '../modelli/cat-fact';

@Service()
export class CatService {
  private readonly http = inject(HttpClient);

  getRandomFact(): Observable<CatFact> {
    return this.http.get<CatFact>('https://catfact.ninja/fact');
  }
}
