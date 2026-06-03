import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

interface ObservacionDisciplinaria {
  id: string;
  docente: {
    nombre: string;
    apellidos: string;
  };
  fecha_incidente: string;
  categoria: 'LEVE' | 'GRAVE' | 'CONVIVENCIA';
  descripcion: string;
  estado: string;
  createdAt: string;
}

@Component({
  selector: 'app-student-discipline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-discipline.component.html',
  styleUrls: ['./student-discipline.component.css']
})
export class StudentDisciplineComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  observaciones = signal<ObservacionDisciplinaria[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string>('');

  ngOnInit(): void {
    this.loadObservaciones();
  }

  loadObservaciones(): void {
    const studentId = this.authService.currentUser()?.id;
    if (!studentId) {
      this.errorMessage.set('No se pudo identificar la sesión del estudiante.');
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.http.get<ObservacionDisciplinaria[]>(`http://localhost:3000/discipline/estudiante/${studentId}`).subscribe({
      next: (data) => {
        // Sort observations by date of incident (latest first)
        data.sort((a, b) => new Date(b.fecha_incidente).getTime() - new Date(a.fecha_incidente).getTime());
        this.observaciones.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar historial disciplinario:', err);
        this.errorMessage.set('Ocurrió un error al cargar tu bitácora de convivencia escolar.');
        this.isLoading.set(false);
      }
    });
  }

  // Count summaries
  getLeveCount(): number {
    return this.observaciones().filter(o => o.categoria === 'LEVE').length;
  }

  getConvivenciaCount(): number {
    return this.observaciones().filter(o => o.categoria === 'CONVIVENCIA').length;
  }

  getGraveCount(): number {
    return this.observaciones().filter(o => o.categoria === 'GRAVE').length;
  }
}
