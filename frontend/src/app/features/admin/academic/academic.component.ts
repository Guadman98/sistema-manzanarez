import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-academic',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './academic.component.html',
  styleUrls: ['./academic.component.css']
})
export class AcademicComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  grados: any[] = [];
  asignaturas: any[] = [];
  planes: any[] = [];
  asignaciones: any[] = [];
  matriculas: any[] = [];
  periodos: any[] = [];
  
  teachers: any[] = [];
  students: any[] = [];

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  gradoForm!: FormGroup;
  asignaturaForm!: FormGroup;
  vincularForm!: FormGroup;
  asignarDocenteForm!: FormGroup;
  matricularForm!: FormGroup;
  periodoForm!: FormGroup;

  activeTab: 'malla' | 'matriculas' | 'periodos' = 'malla';
  showConfirmCierreId: string | null = null;

  ngOnInit(): void {
    this.initForms();
    this.loadData();
  }

  initForms(): void {
    this.gradoForm = this.fb.group({
      nombre: ['', [Validators.required]]
    });

    this.asignaturaForm = this.fb.group({
      nombre: ['', [Validators.required]]
    });

    this.vincularForm = this.fb.group({
      grado_id: ['', [Validators.required]],
      asignatura_id: ['', [Validators.required]]
    });

    this.asignarDocenteForm = this.fb.group({
      docente_id: ['', [Validators.required]],
      plan_estudio_id: ['', [Validators.required]]
    });

    this.matricularForm = this.fb.group({
      estudiante_id: ['', [Validators.required]],
      grado_id: ['', [Validators.required]],
      ano_lectivo: [2026, [Validators.required, Validators.min(2020)]]
    });

    this.periodoForm = this.fb.group({
      numero: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      nombre: ['', [Validators.required]],
      ano_lectivo: [2026, [Validators.required, Validators.min(2020)]]
    });
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const usuarios$ = this.http.get<any[]>('http://localhost:3000/users');
    const grados$ = this.http.get<any[]>('http://localhost:3000/academic/grados');
    const asignaturas$ = this.http.get<any[]>('http://localhost:3000/academic/asignaturas');
    const planes$ = this.http.get<any[]>('http://localhost:3000/academic/planes');
    const asignaciones$ = this.http.get<any[]>('http://localhost:3000/academic/asignaciones');
    const matriculas$ = this.http.get<any[]>('http://localhost:3000/academic/matriculas');
    const periodos$ = this.http.get<any[]>('http://localhost:3000/grades/periodos');

    forkJoin({
      usuarios: usuarios$,
      grados: grados$,
      asignaturas: asignaturas$,
      planes: planes$,
      asignaciones: asignaciones$,
      matriculas: matriculas$,
      periodos: periodos$
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.grados = res.grados;
        this.asignaturas = res.asignaturas;
        this.planes = res.planes;
        this.asignaciones = res.asignaciones;
        this.matriculas = res.matriculas;
        this.periodos = res.periodos;

        this.teachers = res.usuarios.filter(u => u.role === 'TEACHER' && u.isActive);
        this.students = res.usuarios.filter(u => u.role === 'STUDENT' && u.isActive);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Error al cargar los datos académicos. Verifica la conexión con el backend.';
      }
    });
  }

  crearGrado(): void {
    if (this.gradoForm.invalid) return;
    this.http.post<any>('http://localhost:3000/academic/grados', this.gradoForm.value).subscribe({
      next: () => {
        this.successMessage = 'Grado creado correctamente.';
        this.gradoForm.reset();
        this.loadData();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Error al crear el grado escolar.';
      }
    });
  }

  crearAsignatura(): void {
    if (this.asignaturaForm.invalid) return;
    this.http.post<any>('http://localhost:3000/academic/asignaturas', this.asignaturaForm.value).subscribe({
      next: () => {
        this.successMessage = 'Asignatura creada correctamente.';
        this.asignaturaForm.reset();
        this.loadData();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Error al crear la asignatura académica.';
      }
    });
  }

  vincularMateria(): void {
    if (this.vincularForm.invalid) return;
    this.http.post<any>('http://localhost:3000/academic/planes', this.vincularForm.value).subscribe({
      next: () => {
        this.successMessage = 'Materia vinculada al grado con éxito.';
        this.vincularForm.reset();
        this.loadData();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Esta vinculación ya está registrada.';
      }
    });
  }

  asignarDocente(): void {
    if (this.asignarDocenteForm.invalid) return;
    this.http.post<any>('http://localhost:3000/academic/asignaciones', this.asignarDocenteForm.value).subscribe({
      next: () => {
        this.successMessage = 'Docente asignado con éxito.';
        this.asignarDocenteForm.reset();
        this.loadData();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Esta asignación docente ya está registrada.';
      }
    });
  }

  matricularEstudiante(): void {
    if (this.matricularForm.invalid) return;
    this.http.post<any>('http://localhost:3000/academic/matriculas', this.matricularForm.value).subscribe({
      next: () => {
        this.successMessage = 'Estudiante matriculado con éxito.';
        this.matricularForm.reset({ ano_lectivo: 2026 });
        this.loadData();
      },
      error: (err) => {
        this.errorMessage = err.message || 'El estudiante ya cuenta con matrícula para este año lectivo.';
      }
    });
  }

  getAsignacion(planId: string): any {
    return this.asignaciones.find(a => a.planEstudio.id === planId);
  }

  crearPeriodo(): void {
    if (this.periodoForm.invalid) return;
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      ...this.periodoForm.value,
      numero: parseInt(this.periodoForm.value.numero, 10),
      ano_lectivo: parseInt(this.periodoForm.value.ano_lectivo, 10)
    };

    this.http.post<any>('http://localhost:3000/grades/periodos', payload).subscribe({
      next: () => {
        this.successMessage = 'Periodo académico creado correctamente.';
        this.periodoForm.reset({ ano_lectivo: 2026 });
        this.loadData();
      },
      error: (err) => {
        this.isLoading = false;
        // Si el mensaje es una lista (class-validator), lo formateamos
        const backendMsg = err.error?.message;
        const formattedMsg = Array.isArray(backendMsg) ? backendMsg.join(', ') : backendMsg;
        this.errorMessage = formattedMsg || err.message || 'Error al crear el periodo académico.';
      }
    });
  }

  activarPeriodo(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.http.put<any>(`http://localhost:3000/grades/periodos/${id}`, { activo: true }).subscribe({
      next: () => {
        this.successMessage = 'Periodo académico activado con éxito.';
        this.loadData();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || err.message || 'Error al activar el periodo.';
      }
    });
  }

  cerrarPeriodo(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.showConfirmCierreId = null;

    this.http.post<any>(`http://localhost:3000/grades/periodos/${id}/cerrar`, {}).subscribe({
      next: () => {
        this.successMessage = 'Periodo académico cerrado definitivamente y calificaciones selladas.';
        this.loadData();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || err.message || 'Error al cerrar el periodo.';
      }
    });
  }
}
