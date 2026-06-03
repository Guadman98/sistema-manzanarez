import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);

  stats = {
    totalUsers: 0,
    studentsCount: 0,
    teachersCount: 0,
    adminsCount: 0,
    gradosCount: 0,
    asignaturasCount: 0,
    certificatesCount: 0,
    pendingCertificatesCount: 0
  };

  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const users$ = this.http.get<any[]>('http://localhost:3000/users');
    const grados$ = this.http.get<any[]>('http://localhost:3000/academic/grados');
    const asignaturas$ = this.http.get<any[]>('http://localhost:3000/academic/asignaturas');
    const certificates$ = this.http.get<any[]>('http://localhost:3000/certificates');

    forkJoin({
      users: users$,
      grados: grados$,
      asignaturas: asignaturas$,
      certificates: certificates$
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        
        const users = res.users;
        this.stats.totalUsers = users.length;
        this.stats.studentsCount = users.filter(u => u.role === 'STUDENT').length;
        this.stats.teachersCount = users.filter(u => u.role === 'TEACHER').length;
        this.stats.adminsCount = users.filter(u => u.role === 'ADMIN').length;

        this.stats.gradosCount = res.grados.length;
        this.stats.asignaturasCount = res.asignaturas.length;
        
        this.stats.certificatesCount = res.certificates.length;
        this.stats.pendingCertificatesCount = res.certificates.filter(c => c.estado === 'PENDIENTE').length;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Ocurrió un error al cargar las estadísticas rápidas. Asegúrate de levantar el backend y la base de datos.';
        console.error(err);
      }
    });
  }
}
