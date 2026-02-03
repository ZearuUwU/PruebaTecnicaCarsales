import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { ToastNotificationComponent } from './components/toast-notification/toast-notification.component';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastNotificationComponent, LoadingOverlayComponent],
  template: `
    <app-loading-overlay></app-loading-overlay>
    <app-toast-notification></app-toast-notification>
    <router-outlet></router-outlet>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'RickBFF Frontend';
}