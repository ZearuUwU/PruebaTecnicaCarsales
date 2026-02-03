import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, retry, throwError, timer } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { LoadingOverlayService } from '../services/loading-overlay.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const loadingOverlay = inject(LoadingOverlayService);

  return next(req).pipe(
    retry({
      count: 3,
      delay: (error, retryCount) => {
        if (error.status === 429) {
          loadingOverlay.show(`Límite de API alcanzado. Reintentando (${retryCount}/3) en 3s...`);
          return timer(3000);
        }
        return throwError(() => error);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      loadingOverlay.hide();
      let errorMessage = 'Ocurrió un error inesperado';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 404:
            errorMessage = 'Recurso no encontrado (404)';
            break;
          case 500:
            errorMessage = 'Error interno del servidor (500)';
            break;
          case 429:
            errorMessage = 'Demasiadas solicitudes. Por favor espera un momento (429)';
            break;
          case 0:
            errorMessage = 'Error de conexión. Verifica tu internet';
            break;
          default:
            errorMessage = `Error ${error.status}: ${error.message}`;
        }
      }

      notificationService.showError(errorMessage);
      return throwError(() => error);
    })
  );
};
