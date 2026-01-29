import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { EpisodeListComponent } from './components/episode-list/episode-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, EpisodeListComponent],
  template: `<app-episode-list></app-episode-list>`,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}