import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.css']
})
export class CertificatesComponent implements OnInit {
  private http = inject(HttpClient);

  certificates: any[] = [];
  filteredCertificates: any[] = [];
  filterStatus = 'TODOS'; // TODOS, PENDIENTE, APROBADO

  isLoading = false;
  isProcessing = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.loadCertificates();
  }

  loadCertificates(): void {
    this.isLoading = true;
    this.http.get<any[]>('http://localhost:3000/certificates').subscribe({
      next: (res) => {
        this.isLoading = false;
        this.certificates = res;
        this.filterList();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Error al recuperar las solicitudes de certificados del servidor.';
      }
    });
  }

  filterList(): void {
    if (this.filterStatus === 'TODOS') {
      this.filteredCertificates = [...this.certificates];
    } else {
      this.filteredCertificates = this.certificates.filter(c => c.estado === this.filterStatus);
    }
  }

  aprobarCertificado(id: string): void {
    this.isProcessing = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.http.post<any>(`http://localhost:3000/certificates/${id}/aprobar`, {}).subscribe({
      next: (res) => {
        this.isProcessing = false;
        this.successMessage = `Certificado aprobado con éxito. Código Generado: ${res.codigo_verificacion}`;
        this.loadCertificates();
      },
      error: (err) => {
        this.isProcessing = false;
        this.errorMessage = err.message || 'Error al aprobar el certificado escolar.';
      }
    });
  }

  copiarCodigo(codigo: string): void {
    navigator.clipboard.writeText(codigo).then(() => {
      // Mostrar feedback visual
      this.successMessage = `Código de verificación [${codigo}] copiado al portapapeles.`;
      setTimeout(() => this.successMessage = '', 4000);
    });
  }
}
