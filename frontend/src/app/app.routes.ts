import { Routes } from '@angular/router';
import { EpisodeListComponent } from './components/episode-list/episode-list.component';
import { CharacterListComponent } from './components/character-list/character-list.component';

export const routes: Routes = [
    { path: '', component: EpisodeListComponent },
    { path: 'characters', component: CharacterListComponent },
    { path: '**', redirectTo: '' }
];
