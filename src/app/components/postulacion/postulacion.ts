import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostulacionService } from '../../services/postulacion-service';

@Component({
  standalone: true,
  selector: 'app-postulacion',
  templateUrl: './postulacion.html',
  styleUrls: ['./postulacion.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class PostulacionComponent implements OnInit {

  postulaciones: any[] = [];
  form!: FormGroup;
  showForm = false;
  editMode = false;
  idEdit = '';

  estados = ['Pendiente', 'Aceptada', 'Rechazada'];

  constructor(
    private api: PostulacionService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      usuario: ['', Validators.required],
      vacante: ['', Validators.required],
      estado: ['Pendiente', Validators.required]
    });

    this.cargar();
  }

  cargar() {
    this.api.getAll().subscribe(data => this.postulaciones = data);
  }

  mostrarFormulario() {
    this.showForm = true;
    this.editMode = false;
    this.form.reset({ estado: 'Pendiente' });
  }

  ocultarFormulario() {
    this.showForm = false;
    this.editMode = false;
    this.form.reset({ estado: 'Pendiente' });
  }

  guardar() {
    if (this.form.invalid) return;

    if (!this.editMode) {
      this.api.create(this.form.value).subscribe(() => {
        this.cargar();
        this.ocultarFormulario();
      });
    } else {
      this.api.update(this.idEdit, this.form.value).subscribe(() => {
        this.cargar();
        this.ocultarFormulario();
        this.editMode = false;
      });
    }
  }

  editar(item: any) {
    this.showForm = true;
    this.editMode = true;
    this.idEdit = item._id;

    this.form.patchValue({
      usuario: item.usuario.id,
      vacante: item.vacante,
      estado: item.estado
    });
  }

  eliminar(id: string) {
    if (!confirm('¿Desea eliminar esta postulación?')) return;

    this.api.delete(id).subscribe(() => this.cargar());
  }
}
