import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EpisodeService } from '../../services/episode.service';
import { FilterMapperService } from '../../services/filter-mapper.service';
import { Episode } from '../../interfaces/episode.interface';
import { EpisodePlayerComponent } from '../episode-player/episode-player.component';
import { EpisodeCardComponent } from '../episode-card/episode-card.component';
import { finalize, forkJoin, delay, of } from 'rxjs';

import { LoadingOverlayService } from '../../services/loading-overlay.service';

@Component({
  selector: 'app-episode-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, EpisodePlayerComponent, EpisodeCardComponent],
  templateUrl: './episode-list.component.html',
  styleUrl: './episode-list.component.scss'
})
export class EpisodeListComponent implements OnInit {
  private episodeService = inject(EpisodeService);
  private filterMapper = inject(FilterMapperService);
  private loadingOverlay = inject(LoadingOverlayService);

  episodes = signal<Episode[]>([]);

  searchTerm = signal<string>('');
  selectedSeason = signal<string>('All');
  startDate = signal<string | null>(null);

  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  totalItems = signal<number>(0);
  isLoading = signal<boolean>(false);

  selectedEpisode = signal<Episode | null>(null);
  seenEpisodes = signal<Set<number>>(new Set());

  constructor() {
  }

  ngOnInit() {
    this.loadSeenState();
    this.loadEpisodes();
  }

  loadEpisodes() {
    this.isLoading.set(true);
    this.loadingOverlay.show('Cargando episodios...');
    this.episodes.set([]);
    const page = this.currentPage();
    const searchParams = this.filterMapper.mapEpisodeSearchTerm(this.searchTerm());

    const data$ = this.episodeService.getEpisodes(
      page,
      searchParams.name || '',
      searchParams.episode || '',
      this.selectedSeason(),
      this.startDate() || ''
    );

    const minDelay$ = of(true).pipe(delay(500));

    forkJoin([data$, minDelay$])
      .pipe(finalize(() => {
        this.isLoading.set(false);
        this.loadingOverlay.hide();
      }))
      .subscribe({
        next: ([response, _]) => {
          this.episodes.set(response?.results ?? []);
          this.totalPages.set(response?.info?.pages ?? 0);
          this.totalItems.set(response?.info?.count ?? 0);
        },
        error: (e) => {
          this.episodes.set([]);
          this.totalPages.set(0);
          this.totalItems.set(0);
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
