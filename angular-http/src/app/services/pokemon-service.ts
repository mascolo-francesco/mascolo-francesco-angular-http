import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ElencoTipi, Pokemon } from '../modelli/pokemon';

@Service()
export class PokemonService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://pokeapi.co/api/v2';

  getTipi(): Observable<ElencoTipi> {
    return this.http.get<ElencoTipi>(`${this.baseUrl}/type`);
  }

  getPokemon(nomeONumero: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${nomeONumero}`);
  }
}
