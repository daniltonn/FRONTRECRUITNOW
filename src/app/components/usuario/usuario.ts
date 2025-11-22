import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario-service';

@Component({
  standalone: true,
  selector: 'app-usuario',
  templateUrl: './usuario.html',
  imports: [CommonModule, ReactiveFormsModule]
})
export class UsuarioComponent implements OnInit {

  usuarios: any[] = [];
  form!: FormGroup;
  editMode = false;
  idEdit = '';

  constructor(private api: UsuarioService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: [''],
      email: [''],
      contrasena: ['']
    });
    this.cargar();
  }

  cargar() {
    this.api.getAll().subscribe((data: any) => this.usuarios = data);
  }

  guardar() {
    if (!this.editMode) {
      this.api.create(this.form.value).subscribe(() => this.cargar());
    } else {
      this.api.update(this.idEdit, this.form.value).subscribe(() => {
        this.editMode = false;
        this.cargar();
      });
    }
    this.form.reset();
  }

  editar(id: string) {
    this.editMode = true;
    this.idEdit = id;
    this.api.get(id).subscribe((data: any) => this.form.patchValue(data));
  }

  eliminar(id: string) {
    this.api.delete(id).subscribe(() => this.cargar());
  }
}
