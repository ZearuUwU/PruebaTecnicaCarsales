import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  message: string;
  type: 'error' | 'success' | 'info';
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  toasts = signal<ToastMessage[]>([]);

  showError(message: string) {
    this.addToast(message, 'error');
  }

  showSuccess(message: string) {
    this.addToast(message, 'success');
  }

  showInfo(message: string) {
    this.addToast(message, 'info');
  }

  remove(id: number) {
    this.toasts.update(t => t.filter(toast => toast.id !== id));
  }

  private addToast(message: string, type: 'error' | 'success' | 'info') {
    const id = Date.now();
    this.toasts.update(t => [...t, { message, type, id }]);

    setTimeout(() => this.remove(id), 5000);
  }
}
