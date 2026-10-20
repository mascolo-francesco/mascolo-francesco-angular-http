import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Apod } from '../modelli/apod';
import { NasaService } from '../services/nasa-service';

@Component({
  imports: [],
  selector: 'app-nasa',
  styleUrl: './nasa.css',
  templateUrl: './nasa.html',
})
export class Nasa implements OnInit {
  private readonly nasaService = inject(NasaService);

  readonly apod = signal<Apod | null>(null);
  readonly loading = signal(false);
  readonly errore = signal<string | null>(null);

  ngOnInit(): void {
    this.loading.set(true);
    this.nasaService.getApod().subscribe({
      next: (dati) => {
        this.apod.set(dati);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errore.set(this.messaggio(err.status));
        this.loading.set(false);
      },
    });
  }

  private messaggio(status: number): string {
    switch (status) {
      case 403:
        return 'Chiave API mancante o non valida: controlla i file in src/environments.';
      case 429:
        return 'Troppe richieste con questa chiave: riprova più tardi.';
      case 0:
        return 'Il server non è raggiungibile: controlla la connessione.';
      default:
        return `Errore ${status} dal server della NASA.`;
    }
  }
}
