import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingOverlayService } from '../../services/loading-overlay.service';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-overlay.component.html',
  styleUrl: './loading-overlay.component.scss'
})
export class LoadingOverlayComponent {
  overlayService = inject(LoadingOverlayService);
}
