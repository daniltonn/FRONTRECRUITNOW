import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { HojaVidaService } from '../../services/hoja-vida-service';

@Component({
  standalone: true,
  selector: 'app-hoja-vida',
  templateUrl: './hoja-vida.html',
  styleUrls: ['./hoja-vida.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class HojaVidaComponent implements OnInit {

  hojasVida: any[] = [];
  form!: FormGroup;
  showForm = false;
  editMode = false;
  idEdit = '';

  constructor(
    private api: HojaVidaService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargar();
  }

  initForm() {
    this.form = this.fb.group({
      usuarioId: ['', Validators.required],
      informacionPersonal: this.fb.group({
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        email: ['', Validators.required],
        telefono: ['', Validators.required],
        direccion: [''],
        fechaNacimiento: [''],
        nacionalidad: ['']
      }),
      resumenProfesional: [''],
      experienciaLaboral: this.fb.array([]),
      educacion: this.fb.array([]),
      habilidades: this.fb.array([]),
      idiomas: this.fb.array([]),
      referencias: this.fb.array([])
    });
  }

  get experienciaLaboral() { return this.form.get('experienciaLaboral') as FormArray; }
  get educacion() { return this.form.get('educacion') as FormArray; }
  get habilidades() { return this.form.get('habilidades') as FormArray; }
  get idiomas() { return this.form.get('idiomas') as FormArray; }
  get referencias() { return this.form.get('referencias') as FormArray; }

  cargar() {
  this.api.getAll().subscribe((res: any) => {
    this.hojasVida = res.data;  // <-- Aquí está la corrección
  });
}




  mostrarFormulario() {
    this.showForm = true;
    this.editMode = false;
    this.form.reset();
  }

  ocultarFormulario() {
    this.showForm = false;
    this.editMode = false;
    this.form.reset();
  }

  agregarHabilidad() {
    this.habilidades.push(this.fb.control(''));
  }

  agregarIdioma() {
    this.idiomas.push(this.fb.group({ idioma: [''], nivel: [''] }));
  }

  agregarReferencia() {
    this.referencias.push(this.fb.group({
      nombre: [''], cargo: [''], empresa: [''], telefono: [''], email: ['']
    }));
  }

  agregarExperiencia() {
    this.experienciaLaboral.push(this.fb.group({
      empresa: [''], cargo: [''], fechaInicio: [''], fechaFin: [''], descripcion: [''], esTrabajoActual: [false]
    }));
  }

  agregarEducacion() {
    this.educacion.push(this.fb.group({
      institucion: [''], titulo: [''], fechaInicio: [''], fechaFin: [''], descripcion: [''], enCurso: [false]
    }));
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
      });
    }
  }
editar(item: any) {
  this.showForm = true;
  this.editMode = true;
  this.idEdit = item._id;

  // Asegurar que usuarioId sea solo el string
  const datosAEnviar = {
    ...item,
    usuarioId: typeof item.usuarioId === 'object' ? item.usuarioId._id : item.usuarioId
  };

  this.form.patchValue(datosAEnviar);

  // Recargar arrays
  this.experienciaLaboral.clear();
  item.experienciaLaboral.forEach((exp: any) => {
    this.experienciaLaboral.push(this.fb.group(exp));
  });

  this.educacion.clear();
  item.educacion.forEach((e: any) => {
    this.educacion.push(this.fb.group(e));
  });

  this.habilidades.clear();
  item.habilidades.forEach((h: any) => {
    this.habilidades.push(this.fb.control(h));
  });

  this.idiomas.clear();
  item.idiomas.forEach((i: any) => {
    this.idiomas.push(this.fb.group(i));
  });

  this.referencias.clear();
  item.referencias.forEach((r: any) => {
    this.referencias.push(this.fb.group(r));
  });
}


  eliminar(id: string) {
    if (!confirm("¿Eliminar Hoja de Vida?")) return;
    this.api.delete(id).subscribe(() => this.cargar());
  }
}
