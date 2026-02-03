import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CharacterService } from '../../services/character.service';
import { Character } from '../../interfaces/character.interface';
import { CharacterCardComponent } from '../character-card/character-card.component';
import { finalize, forkJoin, delay, of } from 'rxjs';

import { LoadingOverlayService } from '../../services/loading-overlay.service';

@Component({
    selector: 'app-character-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, CharacterCardComponent],
    templateUrl: './character-list.component.html',
    styleUrl: './character-list.component.scss'
})
export class CharacterListComponent implements OnInit {
    private characterService = inject(CharacterService);
    private loadingOverlay = inject(LoadingOverlayService);

    characters = signal<Character[]>([]);

    searchTerm = signal<string>('');
    selectedStatus = signal<string>('All');
    selectedSpecies = signal<string>('');
    selectedGender = signal<string>('All');


    currentPage = signal<number>(1);
    totalPages = signal<number>(1);
    totalItems = signal<number>(0);
    isLoading = signal<boolean>(false);

    ngOnInit() {
        this.loadCharacters();
    }

    loadCharacters() {
        this.isLoading.set(true);
        this.loadingOverlay.show('Cargando personajes...');
        this.characters.set([]);

        const data$ = this.characterService.getCharacters(
            this.currentPage(),
            this.searchTerm(),
            this.selectedStatus(),
            this.selectedSpecies(),
            this.selectedGender()
        );

        const minDelay$ = of(true).pipe(delay(500));

        forkJoin([data$, minDelay$])
            .pipe(finalize(() => {
                this.isLoading.set(false);
                this.loadingOverlay.hide();
            }))
            .subscribe({
                next: ([response, _]) => {
                    this.characters.set(response?.results ?? []);
                    this.totalPages.set(response?.info?.pages ?? 0);
                    this.totalItems.set(response?.info?.count ?? 0);
                },
                error: (e) => {
                    this.characters.set([]);
                    this.totalPages.set(0);
                    this.totalItems.set(0);
                }
            });
    }

    onFilterChange() {
        this.currentPage.set(1);
        this.loadCharacters();
    }

    nextPage() {
        if (this.currentPage() < this.totalPages()) {
            this.currentPage.update(p => p + 1);
            this.loadCharacters();
        }
    }

    prevPage() {
        if (this.currentPage() > 1) {
            this.currentPage.update(p => p - 1);
            this.loadCharacters();
        }
    }

    resetFilters() {
        this.searchTerm.set('');
        this.selectedStatus.set('All');
        this.selectedSpecies.set('');
        this.selectedGender.set('All');
        this.currentPage.set(1);
        this.loadCharacters();
    }
}
