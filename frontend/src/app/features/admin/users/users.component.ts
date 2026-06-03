import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm = '';
  
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  showModal = false;
  isEditMode = false;
  selectedUserId: string | null = null;
  userForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      documento_identidad: ['', [Validators.required, Validators.minLength(4)]],
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      role: ['STUDENT', [Validators.required]],
      fecha_nacimiento: [''],
      nombre_acudiente: [''],
      telefono_acudiente: [''],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  loadUsers(): void {
    this.isLoading = true;
    this.http.get<any[]>('http://localhost:3000/users').subscribe({
      next: (res) => {
        this.isLoading = false;
        this.users = res;
        this.filterUsers();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Error al cargar los usuarios. Revisa la conexión con el servidor.';
      }
    });
  }

  filterUsers(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredUsers = this.users.filter(u =>
        u.nombre.toLowerCase().includes(term) ||
        u.apellidos.toLowerCase().includes(term) ||
        u.documento_identidad.includes(term) ||
        u.role.toLowerCase().includes(term)
      );
    }
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedUserId = null;
    this.userForm.reset({ role: 'STUDENT' });
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.showModal = true;
  }

  openEditModal(user: any): void {
    this.isEditMode = true;
    this.selectedUserId = user.id;
    this.userForm.reset({
      documento_identidad: user.documento_identidad,
      nombre: user.nombre,
      apellidos: user.apellidos,
      email: user.email,
      telefono: user.telefono || '',
      role: user.role,
      fecha_nacimiento: user.fecha_nacimiento || '',
      nombre_acudiente: user.nombre_acudiente || '',
      telefono_acudiente: user.telefono_acudiente || '',
      password: ''
    });
    this.userForm.get('password')?.setValidators([Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveUser(): void {
    if (this.userForm.invalid) return;

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = { ...this.userForm.value };
    if (this.isEditMode && !payload.password) {
      delete payload.password;
    }

    if (this.isEditMode && this.selectedUserId) {
      this.http.put<any>(`http://localhost:3000/users/${this.selectedUserId}`, payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.showModal = false;
          this.successMessage = 'Usuario actualizado correctamente.';
          this.loadUsers();
        },
        error: (err) => {
          this.isSaving = false;
          this.errorMessage = err.message || 'Error al actualizar el usuario.';
        }
      });
    } else {
      this.http.post<any>('http://localhost:3000/users', payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.showModal = false;
          this.successMessage = 'Usuario creado correctamente.';
          this.loadUsers();
        },
        error: (err) => {
          this.isSaving = false;
          this.errorMessage = err.message || 'El documento o correo ya están registrados en el sistema.';
        }
      });
    }
  }

  toggleUserStatus(user: any): void {
    const newStatus = !user.isActive;
    this.http.put<any>(`http://localhost:3000/users/${user.id}`, { isActive: newStatus }).subscribe({
      next: () => {
        user.isActive = newStatus;
        this.successMessage = `Usuario ${newStatus ? 'activado' : 'desactivado'} con éxito.`;
      },
      error: () => {
        this.errorMessage = 'No se pudo cambiar el estado del usuario.';
      }
    });
  }
}
