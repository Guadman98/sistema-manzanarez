import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const requiredRoles = route.data?.['roles'] as string[];
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const hasRole = authService.hasRole(requiredRoles);
  if (!hasRole) {
    const role = authService.currentUser()?.role;
    if (role === 'ADMIN') {
      router.navigate(['/admin/dashboard']);
    } else if (role === 'TEACHER') {
      router.navigate(['/teacher/classes']);
    } else {
      router.navigate(['/student/grades']);
    }
    return false;
  }

  return true;
};
