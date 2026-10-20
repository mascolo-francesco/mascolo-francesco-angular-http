import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CatFact } from '../modelli/cat-fact';
import { CatService } from '../services/cat-service';

@Component({
  imports: [],
  selector: 'app-gatti',
  styleUrl: './gatti.css',
  templateUrl: './gatti.html',
})
export class Gatti implements OnInit {
  private readonly catService = inject(CatService);

  readonly fatto = signal<CatFact | null>(null);
  readonly loading = signal(false);
  readonly errore = signal<string | null>(null);

  ngOnInit(): void {
    this.nuovoFatto();
  }

  nuovoFatto(): void {
    this.loading.set(true);
    this.errore.set(null);
    this.catService.getRandomFact().subscribe({
      next: (dato) => {
        this.fatto.set(dato);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errore.set(`Errore ${err.status}: ${err.message}`);
        this.loading.set(false);
      },
    });
  }
}
