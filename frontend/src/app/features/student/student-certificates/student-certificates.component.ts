import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface CertificadoRequest {
  id: string;
  tipo: 'ESTUDIO' | 'NOTAS';
  codigo_verificacion: string | null;
  estado: 'PENDIENTE' | 'APROBADO';
  fecha_solicitud: string;
  fecha_aprobacion: string | null;
}

@Component({
  selector: 'app-student-certificates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-certificates.component.html',
  styleUrls: ['./student-certificates.component.css']
})
export class StudentCertificatesComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);

  // States
  solicitudes = signal<CertificadoRequest[]>([]);
  isLoading = signal<boolean>(true);
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  
  // Form input
  tipoCertificado = 'ESTUDIO'; // default

  // Helper track for clipboard copying
  copiedCodeId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadSolicitudes();
  }

  loadSolicitudes(): void {
    const studentId = this.authService.currentUser()?.id;
    if (!studentId) {
      this.errorMessage.set('No se pudo identificar la sesión del estudiante.');
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.http.get<CertificadoRequest[]>(`http://localhost:3000/certificates/estudiante/${studentId}`).subscribe({
      next: (data) => {
        // Sort by request date (latest first)
        data.sort((a, b) => new Date(b.fecha_solicitud).getTime() - new Date(a.fecha_solicitud).getTime());
        this.solicitudes.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar solicitudes:', err);
        this.errorMessage.set('Ocurrió un error al obtener tu historial de solicitudes.');
        this.isLoading.set(false);
      }
    });
  }

  solicitarCertificado(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.isSubmitting.set(true);

    const body = {
      tipo: this.tipoCertificado
    };

    this.http.post('http://localhost:3000/certificates', body).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.successMessage.set('Tu solicitud de certificado ha sido radicada. El Administrador del Liceo la procesará pronto.');
        this.loadSolicitudes();
        
        setTimeout(() => {
          this.successMessage.set('');
        }, 5000);
      },
      error: (err) => {
        console.error('Error al solicitar certificado:', err);
        this.errorMessage.set(err.error?.message || 'Error al enviar la solicitud de certificado.');
        this.isSubmitting.set(false);
      }
    });
  }

  copiarCodigo(req: CertificadoRequest): void {
    if (!req.codigo_verificacion) return;

    navigator.clipboard.writeText(req.codigo_verificacion).then(() => {
      this.copiedCodeId.set(req.id);
      setTimeout(() => {
        if (this.copiedCodeId() === req.id) {
          this.copiedCodeId.set(null);
        }
      }, 2000);
    }).catch(err => {
      console.error('No se pudo copiar el código:', err);
    });
  }

  irAVerificacion(codigo: string): void {
    // Navigate to the public page, passing the code in query parameters
    this.router.navigate(['/verify-certificate'], { queryParams: { code: codigo } });
  }
}
