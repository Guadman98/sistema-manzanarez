import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { VerifyCertificateComponent } from './features/certificates/verify-certificate/verify-certificate.component';
import { AdminLayoutComponent } from './features/admin/admin-layout/admin-layout.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { UsersComponent } from './features/admin/users/users.component';
import { AcademicComponent } from './features/admin/academic/academic.component';
import { CertificatesComponent } from './features/admin/certificates/certificates.component';
import { TeacherLayoutComponent } from './features/teacher/teacher-layout/teacher-layout.component';
import { ClassesComponent } from './features/teacher/classes/classes.component';
import { GradesSheetComponent } from './features/teacher/grades-sheet/grades-sheet.component';
import { DisciplineComponent } from './features/teacher/discipline/discipline.component';
import { StudentLayoutComponent } from './features/student/student-layout/student-layout.component';
import { StudentGradesComponent } from './features/student/student-grades/student-grades.component';
import { StudentDisciplineComponent } from './features/student/student-discipline/student-discipline.component';
import { StudentCertificatesComponent } from './features/student/student-certificates/student-certificates.component';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'verify-certificate', component: VerifyCertificateComponent },
  
  // Portal de Administrador (Protegido con roleGuard para rol ADMIN)
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'academic', component: AcademicComponent },
      { path: 'certificates', component: CertificatesComponent }
    ]
  },

  // Portal de Docente (Protegido con roleGuard para rol TEACHER)
  {
    path: 'teacher',
    component: TeacherLayoutComponent,
    canActivate: [roleGuard],
    data: { roles: ['TEACHER'] },
    children: [
      { path: '', redirectTo: 'classes', pathMatch: 'full' },
      { path: 'classes', component: ClassesComponent },
      { path: 'grades/:planEstudioId', component: GradesSheetComponent },
      { path: 'discipline', component: DisciplineComponent }
    ]
  },

  // Portal de Estudiante (Protegido con roleGuard para rol STUDENT)
  {
    path: 'student',
    component: StudentLayoutComponent,
    canActivate: [roleGuard],
    data: { roles: ['STUDENT'] },
    children: [
      { path: '', redirectTo: 'grades', pathMatch: 'full' },
      { path: 'grades', component: StudentGradesComponent },
      { path: 'discipline', component: StudentDisciplineComponent },
      { path: 'certificates', component: StudentCertificatesComponent }
    ]
  }
];


