import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Character } from '../../interfaces/character.interface';

@Component({
    selector: 'app-character-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="char-card" tabindex="0">
      <div class="char-image">
        <img [src]="character().image" [alt]="character().name" loading="lazy">
        <div class="status-badge" [ngClass]="character().status.toLowerCase()">
          {{ character().status }}
        </div>
      </div>
      
      <div class="char-content">
        <h3>{{ character().name }}</h3>
        
        <div class="tags">
          <span>{{ character().species }}</span>
          <span>{{ character().gender }}</span>
        </div>

        <div class="detail">
          Episodes: <strong>{{ character().episode.length }}</strong>
        </div>
      </div>
    </div>
  `,
    styleUrls: ['./character-card.component.scss']
})
export class CharacterCardComponent {
    character = input.required<Character>();
}
