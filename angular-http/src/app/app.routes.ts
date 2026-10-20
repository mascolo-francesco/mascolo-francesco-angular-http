import { Routes } from '@angular/router';
import { Posts } from './posts/posts';
import { Gatti } from './gatti/gatti';
import { Nasa } from './nasa/nasa';

export const routes: Routes = [
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
  { path: 'posts', component: Posts },
  { path: 'gatti', component: Gatti },
  { path: 'nasa', component: Nasa },
  { path: '**', redirectTo: 'posts' },
];
