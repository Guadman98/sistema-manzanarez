import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError(err => {
      if ([401, 403].includes(err.status)) {
        // Redirigir y limpiar sesión ante expiración de token o falta de permisos
        authService.logout();
      }

      const errorMsg = err.error?.message || err.error?.error || err.statusText;
      return throwError(() => new Error(errorMsg));
    })
  );
};
