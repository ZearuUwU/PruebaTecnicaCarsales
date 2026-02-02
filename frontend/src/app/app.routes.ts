import { Routes } from '@angular/router';
import { EpisodeListComponent } from './components/episode-list/episode-list.component';

export const routes: Routes = [
    { path: '', component: EpisodeListComponent },
    { path: '**', redirectTo: '' }
];
