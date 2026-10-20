import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Pokemon, RisorsaConNome } from '../modelli/pokemon';
import { PokemonService } from '../services/pokemon-service';

@Component({
  imports: [],
  selector: 'app-pokedex',
  styleUrl: './pokedex.css',
  templateUrl: './pokedex.html',
})
export class Pokedex implements OnInit {
  private readonly pokemonService = inject(PokemonService);

  readonly tipi = signal<RisorsaConNome[]>([]);
  readonly pokemon = signal<Pokemon | null>(null);
  readonly loading = signal(false);
  readonly errore = signal<string | null>(null);

  ngOnInit(): void {
    this.pokemonService.getTipi().subscribe({
      next: (dati) => this.tipi.set(dati.results),
      error: (err: HttpErrorResponse) => this.errore.set(`Errore ${err.status}: ${err.message}`),
    });
  }

  cerca(testo: string): void {
    const ricerca = testo.trim().toLowerCase();
    if (ricerca === '') {
      return;
    }
    this.loading.set(true);
    this.errore.set(null);
    this.pokemon.set(null);
    this.pokemonService.getPokemon(ricerca).subscribe({
      next: (dato) => {
        this.pokemon.set(dato);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errore.set(err.status === 404 ? 'Pokémon non trovato' : `Errore ${err.status}: ${err.message}`);
        this.loading.set(false);
      },
    });
  }
}
