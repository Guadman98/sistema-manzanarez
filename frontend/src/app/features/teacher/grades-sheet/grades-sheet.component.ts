import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface AlumnoPlanilla {
  estudiante_id: string;
  estudiante_nombre: string;
  documento_identidad: string;
  calificacion_id: string | null;
  nota_original: number | null;
  nota_nivelacion: number | null;
  nota_definitiva: number | null;
  requiere_nivelacion: boolean;
  
  // Local UI states
  temp_nota_original?: number | null;
  temp_nota_nivelacion?: number | null;
  isSavingOriginal?: boolean;
  isSavingNivelacion?: boolean;
  saveError?: string;
  saveSuccess?: boolean;
}

interface PeriodoActivo {
  id: string;
  nombre: string;
  numero: number;
  ano_lectivo: number;
}

interface PlanillaDocenteResponse {
  plan_estudio_id: string;
  grado: string;
  asignatura: string;
  asignatura_id: string;
  periodo_activo: PeriodoActivo;
  alumnos: AlumnoPlanilla[];
}

@Component({
  selector: 'app-grades-sheet',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './grades-sheet.component.html',
  styleUrls: ['./grades-sheet.component.css']
})
export class GradesSheetComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  planEstudioId = '';
  planilla = signal<PlanillaDocenteResponse | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string>('');
  
  searchTerm = signal<string>('');

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.planEstudioId = params['planEstudioId'];
      if (this.planEstudioId) {
        this.loadPlanilla();
      }
    });
  }

  loadPlanilla(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.http.get<PlanillaDocenteResponse>(`http://localhost:3000/grades/planilla/${this.planEstudioId}`).subscribe({
      next: (res) => {
        // Initialize temp UI states
        res.alumnos = res.alumnos.map(al => ({
          ...al,
          temp_nota_original: al.nota_original,
          temp_nota_nivelacion: al.nota_nivelacion,
          isSavingOriginal: false,
          isSavingNivelacion: false,
          saveSuccess: false
        })).sort((a, b) => a.estudiante_nombre.localeCompare(b.estudiante_nombre));

        this.planilla.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar planilla:', err);
        const backendError = err.error?.message || '';
        this.errorMessage.set(backendError || 'Error al obtener la planilla de calificaciones. Asegúrate de que el periodo escolar esté activo y que el administrador te haya asignado a esta clase.');
        this.isLoading.set(false);
      }
    });
  }

  validateNota(nota: number | null | undefined): boolean {
    if (nota === null || nota === undefined) return false;
    const parsed = Number(nota);
    return !isNaN(parsed) && parsed >= 0.0 && parsed <= 5.0;
  }

  filteredAlumnos(): AlumnoPlanilla[] {
    const pl = this.planilla();
    if (!pl) return [];
    
    const query = this.searchTerm().trim().toLowerCase();
    if (!query) return pl.alumnos;

    return pl.alumnos.filter(al => 
      al.estudiante_nombre.toLowerCase().includes(query) || 
      al.documento_identidad.toLowerCase().includes(query)
    );
  }

  guardarNotaOriginal(alumno: AlumnoPlanilla): void {
    const pl = this.planilla();
    if (!pl) return;

    const nota = alumno.temp_nota_original;
    if (nota === null || nota === undefined || String(nota).trim() === '') {
      alumno.saveError = 'Ingresa una nota.';
      return;
    }

    const numericNota = Number(nota);
    if (!this.validateNota(numericNota)) {
      alumno.saveError = 'La nota debe estar entre 0.0 y 5.0';
      return;
    }

    alumno.isSavingOriginal = true;
    alumno.saveError = '';
    alumno.saveSuccess = false;

    const body = {
      estudiante_id: alumno.estudiante_id,
      asignatura_id: pl.asignatura_id,
      periodo_id: pl.periodo_activo.id,
      nota_original: numericNota
    };

    this.http.post<any>('http://localhost:3000/grades/registrar', body).subscribe({
      next: (res) => {
        alumno.isSavingOriginal = false;
        alumno.saveSuccess = true;
        this.loadPlanilla();
        setTimeout(() => {
          alumno.saveSuccess = false;
        }, 3000);
      },
      error: (err) => {
        console.error('Error al registrar nota:', err);
        alumno.isSavingOriginal = false;
        alumno.saveError = err.error?.message || 'Error al guardar la nota.';
      }
    });
  }

  guardarNotaNivelacion(alumno: AlumnoPlanilla): void {
    if (!alumno.calificacion_id) {
      alumno.saveError = 'Debe registrar la nota original primero.';
      return;
    }

    const nota = alumno.temp_nota_nivelacion;
    if (nota === null || nota === undefined || String(nota).trim() === '') {
      alumno.saveError = 'Ingresa la nota de nivelación.';
      return;
    }

    const numericNota = Number(nota);
    if (!this.validateNota(numericNota)) {
      alumno.saveError = 'La nota debe estar entre 0.0 y 5.0';
      return;
    }

    alumno.isSavingNivelacion = true;
    alumno.saveError = '';
    alumno.saveSuccess = false;

    const body = {
      nota_nivelacion: numericNota
    };

    this.http.post<any>(`http://localhost:3000/grades/nivelar/${alumno.calificacion_id}`, body).subscribe({
      next: (res) => {
        alumno.isSavingNivelacion = false;
        alumno.saveSuccess = true;
        this.loadPlanilla();
        setTimeout(() => {
          alumno.saveSuccess = false;
        }, 3000);
      },
      error: (err) => {
        console.error('Error al registrar nivelación:', err);
        alumno.isSavingNivelacion = false;
        alumno.saveError = err.error?.message || 'Error al guardar la nivelación.';
      }
    });
  }
}
