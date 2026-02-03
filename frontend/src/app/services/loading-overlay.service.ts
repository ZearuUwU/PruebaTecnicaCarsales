import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingOverlayService {
  isLoading = signal<boolean>(false);
  message = signal<string>('Esperando respuesta del servidor...');

  show(msg: string = 'Esperando respuesta del servidor...') {
    this.message.set(msg);
    this.isLoading.set(true);
  }

  hide() {
    this.isLoading.set(false);
  }
}
