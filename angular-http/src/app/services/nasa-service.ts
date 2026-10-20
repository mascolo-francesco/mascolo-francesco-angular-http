import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Apod } from '../modelli/apod';
import { environment } from '../../environments/environment';

@Service()
export class NasaService {
  private readonly http = inject(HttpClient);
  private readonly url = 'https://api.nasa.gov/planetary/apod';

  getApod(): Observable<Apod> {
    return this.http.get<Apod>(this.url, { params: { api_key: environment.nasaApiKey } });
  }
}
