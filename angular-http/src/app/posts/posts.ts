import { Component, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Post } from '../modelli/post';
import { PostService } from '../services/post-service';

@Component({
  imports: [JsonPipe],
  selector: 'app-posts',
  styleUrl: './posts.css',
  templateUrl: './posts.html',
})
export class Posts {
  private readonly postService = inject(PostService);

  readonly post = signal<Post | null>(null);
  readonly posts = signal<Post[]>([]);
  readonly loading = signal(false);
  readonly errore = signal<string | null>(null);

  caricaUno(numero: string): void {
    this.inizia();
    this.postService.getPost(Number(numero)).subscribe({
      next: (dato) => {
        this.post.set(dato);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => this.gestisciErrore(err),
    });
  }

  private inizia(): void {
    this.loading.set(true);
    this.errore.set(null);
  }

  private gestisciErrore(err: HttpErrorResponse): void {
    this.errore.set(`Errore ${err.status}: ${err.message}`);
    this.loading.set(false);
  }
}
