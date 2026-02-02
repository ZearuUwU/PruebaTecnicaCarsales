import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EpisodeService } from '../../services/episode.service';
import { Episode } from '../../interfaces/episode.interface';
import { EpisodePlayerComponent } from '../episode-player/episode-player.component';
import { EpisodeCardComponent } from '../episode-card/episode-card.component';

@Component({
  selector: 'app-episode-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, EpisodePlayerComponent, EpisodeCardComponent],
  templateUrl: './episode-list.component.html',
  styleUrl: './episode-list.component.scss'
})
export class EpisodeListComponent implements OnInit {
  private episodeService = inject(EpisodeService);

  episodes = signal<Episode[]>([]);

  searchTerm = signal<string>('');
  selectedSeason = signal<string>('All');
  startDate = signal<string | null>(null);

  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  totalItems = signal<number>(0);

  selectedEpisode = signal<Episode | null>(null);
  seenEpisodes = signal<Set<number>>(new Set());

  constructor() {
  }

  ngOnInit() {
    this.loadSeenState();
    this.loadEpisodes();
  }

  loadEpisodes() {
    const page = this.currentPage();
    const name = this.searchTerm();
    const episode = this.searchTerm().match(/S\d\dE\d\d/i) ? this.searchTerm() : '';
    const cleanName = episode ? '' : name;

    this.episodeService.getEpisodes(
      page,
      cleanName,
      episode,
      this.selectedSeason(),
      this.startDate() || ''
    ).subscribe({
      next: (response) => {
        this.episodes.set(response.results);
        this.totalPages.set(response.info.pages);
        this.totalItems.set(response.info.count);
      },
      error: (e) => {
        console.error('Error loading episodes', e);
        this.episodes.set([]);
        this.totalPages.set(0);
      }
    });
  }

  onFilterChange() {
    this.currentPage.set(1);
    this.loadEpisodes();
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      this.loadEpisodes();
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.loadEpisodes();
    }
  }

  openPlayer(ep: Episode) {
    this.selectedEpisode.set(ep);
    this.toggleSeen(ep.id, true);
  }

  toggleSeen(id: number, forceVal?: boolean) {
    const current = new Set(this.seenEpisodes());
    if (forceVal === true) current.add(id);
    else if (current.has(id)) current.delete(id);
    else current.add(id);

    this.seenEpisodes.set(current);
    localStorage.setItem('seenEpisodes', JSON.stringify(Array.from(current)));
  }

  isSeen(id: number) { return this.seenEpisodes().has(id); }

  private loadSeenState() {
    const saved = localStorage.getItem('seenEpisodes');
    if (saved) this.seenEpisodes.set(new Set(JSON.parse(saved)));
  }

  resetFilters() {
    this.searchTerm.set('');
    this.selectedSeason.set('All');
    this.startDate.set(null);
    this.currentPage.set(1);
    this.loadEpisodes();
  }
}
