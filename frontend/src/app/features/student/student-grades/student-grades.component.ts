import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

interface NotaPeriodo {
  periodo_id: string;
  periodo_numero: number;
  periodo_nombre: string;
  nota_original: number;
  nota_nivelacion: number | null;
  nota_definitiva: number;
  aprobado: boolean;
  es_final: boolean;
}

interface BoletinMateria {
  asignatura_id: string;
  asignatura_nombre: string;
  notas_periodo: NotaPeriodo[];
  promedio_definitivo: number;
  estado_actual: 'APROBADO' | 'REPROBADO';
}

@Component({
  selector: 'app-student-grades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-grades.component.html',
  styleUrls: ['./student-grades.component.css']
})
export class StudentGradesComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  boletin = signal<BoletinMateria[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string>('');

  // Selected year (defaults to 2026)
  selectedYear = signal<number>(2026);
  availableYears = [2026, 2025, 2024];

  ngOnInit(): void {
    this.loadBoletin();
  }

  loadBoletin(): void {
    const studentId = this.authService.currentUser()?.id;
    if (!studentId) {
      this.errorMessage.set('No se pudo identificar la sesión del estudiante.');
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.http.get<BoletinMateria[]>(`http://localhost:3000/grades/boletin/${studentId}/${this.selectedYear()}`).subscribe({
      next: (data) => {
        this.boletin.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar boletín:', err);
        const errorMsg = err.error?.message || 'Asegúrate de que estás matriculado para el año seleccionado y de que haya materias vinculadas a tu curso.';
        this.errorMessage.set(errorMsg);
        this.isLoading.set(false);
        this.boletin.set([]);
      }
    });
  }

  onYearChange(): void {
    this.loadBoletin();
  }

  // Calculate overall average across all subjects
  getGeneralAverage(): number {
    const data = this.boletin();
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, item) => acc + item.promedio_definitivo, 0);
    return Math.round((sum / data.length) * 100) / 100;
  }
}
