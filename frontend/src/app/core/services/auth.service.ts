import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiUrl = 'http://localhost:3000'; // URL de la API de NestJS
  
  // Signal reactivo moderno para almacenar el usuario autenticado
  public currentUser = signal<any | null>(null);

  constructor() {
    const savedUser = localStorage.getItem('lem_user');
    if (savedUser) {
      try {
        this.currentUser.set(JSON.parse(savedUser));
      } catch (e) {
        this.logout();
      }
    }
  }

  login(documento_identidad: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { documento_identidad, password }).pipe(
      tap(res => {
        if (res && res.access_token) {
          localStorage.setItem('lem_token', res.access_token);
          localStorage.setItem('lem_user', JSON.stringify(res.user));
          this.currentUser.set(res.user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('lem_token');
    localStorage.removeItem('lem_user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('lem_token');
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  hasRole(allowedRoles: string[]): boolean {
    const user = this.currentUser();
    if (!user) return false;
    return allowedRoles.includes(user.role);
  }
}
