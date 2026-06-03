import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface AsignacionDocente {
  id: string;
  planEstudio: {
    id: string;
    grado: {
      id: string;
      nombre: string;
    };
    asignatura: {
      id: string;
      nombre: string;
    };
  };
}

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);

  asignaciones = signal<AsignacionDocente[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string>('');

  ngOnInit(): void {
    this.loadAsignaciones();
  }

  loadAsignaciones(): void {
    const teacherId = this.authService.currentUser()?.id;
    if (!teacherId) {
      this.errorMessage.set('No se pudo identificar la sesión del docente.');
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.http.get<AsignacionDocente[]>(`http://localhost:3000/academic/asignaciones/docente/${teacherId}`).subscribe({
      next: (data) => {
        this.asignaciones.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar clases:', err);
        this.errorMessage.set('Ocurrió un error al cargar tus clases asignadas. Por favor, intenta de nuevo.');
        this.isLoading.set(false);
      }
    });
  }

  gestionarNotas(planEstudioId: string): void {
    this.router.navigate(['/teacher/grades', planEstudioId]);
  }
}
