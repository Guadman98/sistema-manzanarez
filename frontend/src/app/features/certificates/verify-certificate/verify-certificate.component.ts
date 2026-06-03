import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verify-certificate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verify-certificate.component.html',
  styleUrls: ['./verify-certificate.component.css']
})
export class VerifyCertificateComponent {
  private http = inject(HttpClient);

  codigo = '';
  isLoading = false;
  resultado: any = null;
  errorMessage = '';

  onSubmit(): void {
    if (!this.codigo.trim()) return;

    this.isLoading = true;
    this.resultado = null;
    this.errorMessage = '';

    const cleanCode = this.codigo.trim();

    this.http.get<any>(`http://localhost:3000/certificates/verify/${cleanCode}`).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.resultado = res;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Código de certificado inválido o no encontrado en el sistema.';
      }
    });
  }

  limpiar(): void {
    this.codigo = '';
    this.resultado = null;
    this.errorMessage = '';
  }
}
