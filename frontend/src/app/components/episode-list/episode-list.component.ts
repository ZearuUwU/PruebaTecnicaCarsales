import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { EpisodeService } from '../../services/episode.service';
import { Episode } from '../../interfaces/episode.interface';
import { EpisodePlayerComponent } from '../episode-player/episode-player.component';

@Component({
  selector: 'app-episode-list',
  standalone: true,
  imports: [CommonModule, FormsModule, EpisodePlayerComponent],
  templateUrl: './episode-list.component.html',
  styleUrl: './episode-list.component.scss'
})
export class EpisodeListComponent implements OnInit {
  private episodeService = inject(EpisodeService);

  allEpisodes = signal<Episode[]>([]); 
  searchTerm = signal<string>('');    
  currentPage = signal<number>(1);
  itemsPerPage = 9;                  
  
  selectedEpisode = signal<Episode | null>(null);

  seenEpisodes = signal<Set<number>>(new Set());

  
  filteredEpisodes = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const episodes = this.allEpisodes();
    
    if (!term) return episodes;

    return episodes.filter(ep => 
      ep.name.toLowerCase().includes(term) || 
      ep.episodeCode.toLowerCase().includes(term)
    );
  });

  paginatedEpisodes = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredEpisodes().slice(startIndex, endIndex);
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredEpisodes().length / this.itemsPerPage);
  });


  ngOnInit() {
    this.loadSeenState();
    this.episodeService.getEpisodes(1).subscribe({
      next: (data) => this.allEpisodes.set(data),
      error: (e) => console.error(e)
    });
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) this.currentPage.update(p => p + 1);
  }
  
  prevPage() {
    if (this.currentPage() > 1) this.currentPage.update(p => p - 1);
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
}