import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Episode } from '../../interfaces/episode.interface';

@Component({
  selector: 'app-episode-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overlay" (click)="close()">
      <div class="modal" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="close()">✖</button>
        
        <div class="video-placeholder">
          <div class="play-icon">▶</div>
          <div class="noise"></div> <div class="scanline"></div>
        </div>

        <div class="info">
          <h2>{{ episode?.episodeCode }} - {{ episode?.name }}</h2>
          <p>Emitido: {{ episode?.airDate }}</p>
          <p class="desc">Simulación de reproducción en curso...</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.85); z-index: 1000;
      display: flex; justify-content: center; align-items: center;
      backdrop-filter: blur(5px);
    }
    .modal {
      background: #1e1e1e; width: 90%; max-width: 800px;
      border-radius: 16px; overflow: hidden;
      box-shadow: 0 0 50px rgba(0, 176, 200, 0.3);
      border: 1px solid #333; position: relative;
    }
    .close-btn {
      position: absolute; top: 10px; right: 10px; z-index: 10;
      background: none; border: none; color: white; font-size: 2rem; cursor: pointer;
    }
    .video-placeholder {
      height: 400px; background: #000; position: relative;
      display: flex; justify-content: center; align-items: center; overflow: hidden;
    }
    .play-icon { font-size: 5rem; color: rgba(255,255,255,0.8); }
    .info { padding: 2rem; color: white; }
    h2 { color: #00b0c8; margin-top: 0; }
    
    /* Efectos CSS puros para simular TV */
    .scanline {
      width: 100%; height: 100px; z-index: 5;
      background: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0, 176, 200, 0.1) 50%, rgba(0,0,0,0) 100%);
      opacity: 0.1; position: absolute; bottom: 100%;
      animation: scanline 10s linear infinite;
    }
    @keyframes scanline { 0% { bottom: 100%; } 100% { bottom: -100%; } }
  `]
})
export class EpisodePlayerComponent {
  @Input() episode: Episode | null = null;
  @Output() closePlayer = new EventEmitter<void>();

  close() { this.closePlayer.emit(); }
}