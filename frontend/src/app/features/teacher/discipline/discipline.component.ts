import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
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

interface EstudianteClase {
  estudiante_id: string;
  estudiante_nombre: string;
  documento_identidad: string;
}

interface PlanillaResponse {
  alumnos: EstudianteClase[];
}

@Component({
  selector: 'app-discipline',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './discipline.component.html',
  styleUrls: ['./discipline.component.css']
})
export class DisciplineComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  // Loaders & Errors
  isLoadingClasses = signal<boolean>(true);
  isLoadingStudents = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  // Source options
  clases = signal<AsignacionDocente[]>([]);
  estudiantes = signal<EstudianteClase[]>([]);

  // Form Fields
  selectedClassId = '';
  selectedStudentId = '';
  fechaIncidente = new Date().toISOString().substring(0, 10); // Defaults YYYY-MM-DD
  categoria = 'LEVE'; // Default
  descripcion = '';

  ngOnInit(): void {
    this.loadClases();
  }

  loadClases(): void {
    const teacherId = this.authService.currentUser()?.id;
    if (!teacherId) {
      this.errorMessage.set('No se pudo identificar la sesión del docente.');
      this.isLoadingClasses.set(false);
      return;
    }

    this.isLoadingClasses.set(true);
    this.errorMessage.set('');

    this.http.get<AsignacionDocente[]>(`http://localhost:3000/academic/asignaciones/docente/${teacherId}`).subscribe({
      next: (data) => {
        this.clases.set(data);
        this.isLoadingClasses.set(false);
      },
      error: (err) => {
        console.error('Error al cargar clases:', err);
        this.errorMessage.set('Error al cargar tus asignaciones para el selector.');
        this.isLoadingClasses.set(false);
      }
    });
  }

  onClassChange(): void {
    this.selectedStudentId = '';
    this.estudiantes.set([]);
    this.errorMessage.set('');

    if (!this.selectedClassId) return;

    this.isLoadingStudents.set(true);

    this.http.get<PlanillaResponse>(`http://localhost:3000/grades/planilla/${this.selectedClassId}`).subscribe({
      next: (data) => {
        this.estudiantes.set(data.alumnos);
        this.isLoadingStudents.set(false);
      },
      error: (err) => {
        console.error('Error al cargar estudiantes:', err);
        this.errorMessage.set('Error al cargar los estudiantes del grado seleccionado.');
        this.isLoadingStudents.set(false);
      }
    });
  }

  setCategoria(cat: string): void {
    this.categoria = cat;
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.selectedStudentId) {
      this.errorMessage.set('Por favor, selecciona un estudiante.');
      return;
    }

    if (!this.fechaIncidente) {
      this.errorMessage.set('Por favor, selecciona la fecha del incidente.');
      return;
    }

    if (!this.descripcion.trim()) {
      this.errorMessage.set('Por favor, describe los detalles del incidente.');
      return;
    }

    this.isSubmitting.set(true);

    const body = {
      estudiante_id: this.selectedStudentId,
      fecha_incidente: this.fechaIncidente,
      categoria: this.categoria,
      descripcion: this.descripcion
    };

    this.http.post('http://localhost:3000/discipline', body).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.successMessage.set('¡Reporte disciplinario registrado correctamente!');
        
        // Reset form details
        this.descripcion = '';
        this.categoria = 'LEVE';
        this.fechaIncidente = new Date().toISOString().substring(0, 10);
        
        // Clear message after 4 seconds
        setTimeout(() => {
          this.successMessage.set('');
        }, 4000);
      },
      error: (err) => {
        console.error('Error al registrar reporte:', err);
        this.errorMessage.set(err.error?.message || 'Error al procesar el reporte disciplinario.');
        this.isSubmitting.set(false);
      }
    });
  }
}
