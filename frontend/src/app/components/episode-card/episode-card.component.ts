import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Episode } from '../../interfaces/episode.interface';

@Component({
  selector: 'app-episode-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="card" 
      [class.watched]="isSeen()"
      (click)="onOpen.emit(episode())" 
      (keydown.enter)="onOpen.emit(episode())"
      tabindex="0"
      role="button"
      [attr.aria-label]="'Ver detalles de ' + episode().name">
      
      <div class="thumbnail" [ngClass]="'season-' + episode().season">
        <span class="play-icon">▶</span>
        <span class="season-tag">Season {{ episode().season }}</span>
        @if (isSeen()) {
          <div class="seen-indicator">VISTO</div>
        }
      </div>

      <div class="content">
        <div class="header">
          <span class="code">{{ episode().episodeCode }}</span>
          <span class="date">{{ episode().airDate }}</span>
        </div>
        <h3 class="title">{{ episode().name }}</h3>
      </div>
    </div>
  `,
  styleUrls: ['./episode-card.component.scss']
})
export class EpisodeCardComponent {
  episode = input.required<Episode>();
  isSeen = input<boolean>(false);

  onOpen = output<Episode>();
}
