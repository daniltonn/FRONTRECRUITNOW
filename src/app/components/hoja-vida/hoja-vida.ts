import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { HojaVidaService } from '../../services/hoja-vida-service';
import { HojaVida, ExperienciaLaboral, Educacion, Idioma, Referencia } from '../../models/hoja-vida';

@Component({
  standalone: true,
  selector: 'app-hoja-vida',
  templateUrl: './hoja-vida.html',
  styleUrls: ['./hoja-vida.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class HojaVidaComponent implements OnInit {

  hojasVida: HojaVida[] = [];
  form!: FormGroup;
  editMode = false;
  idEdit = '';
  showForm = false;

  constructor(
    private api: HojaVidaService, 
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.cargar();
  }

  initForm() {
    this.form = this.fb.group({
      usuarioId: ['', Validators.required],
      datosPersonales: this.fb.group({
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        telefono: ['', Validators.required],
        direccion: [''],
        fechaNacimiento: [''],
        cedula: ['', Validators.required]
      }),
      perfilProfesional: [''],
      experienciaLaboral: this.fb.array([]),
      educacion: this.fb.array([]),
      habilidades: this.fb.array([]),
      idiomas: this.fb.array([]),
      referencias: this.fb.array([])
    });
  }

  // Getters para FormArrays
  get experienciaLaboral() {
    return this.form.get('experienciaLaboral') as FormArray;
  }

  get educacion() {
    return this.form.get('educacion') as FormArray;
  }

  get habilidades() {
    return this.form.get('habilidades') as FormArray;
  }

  get idiomas() {
    return this.form.get('idiomas') as FormArray;
  }

  get referencias() {
    return this.form.get('referencias') as FormArray;
  }

  // Métodos para agregar elementos a los FormArrays
  agregarExperiencia() {
    const experienciaForm = this.fb.group({
      empresa: ['', Validators.required],
      cargo: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: [''],
      descripcion: [''],
      esTrabajoActual: [false]
    });
    this.experienciaLaboral.push(experienciaForm);
  }

  agregarEducacion() {
    const educacionForm = this.fb.group({
      institucion: ['', Validators.required],
      titulo: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: [''],
      descripcion: [''],
      enCurso: [false]
    });
    this.educacion.push(educacionForm);
  }

  agregarHabilidad() {
    const habilidadForm = this.fb.control('', Validators.required);
    this.habilidades.push(habilidadForm);
  }

  agregarIdioma() {
    const idiomaForm = this.fb.group({
      idioma: ['', Validators.required],
      nivel: ['Básico', Validators.required]
    });
    this.idiomas.push(idiomaForm);
  }

  agregarReferencia() {
    const referenciaForm = this.fb.group({
      nombre: ['', Validators.required],
      cargo: ['', Validators.required],
      empresa: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    this.referencias.push(referenciaForm);
  }

  // Métodos para eliminar elementos de los FormArrays
  eliminarExperiencia(index: number) {
    this.experienciaLaboral.removeAt(index);
  }

  eliminarEducacion(index: number) {
    this.educacion.removeAt(index);
  }

  eliminarHabilidad(index: number) {
    this.habilidades.removeAt(index);
  }

  eliminarIdioma(index: number) {
    this.idiomas.removeAt(index);
  }

  eliminarReferencia(index: number) {
    this.referencias.removeAt(index);
  }

  cargar() {
    this.api.getAll().subscribe((data: HojaVida[]) => {
      this.hojasVida = data;
    });
  }

  mostrarFormulario() {
    this.showForm = true;
    this.editMode = false;
    this.form.reset();
    this.limpiarFormArrays();
  }

  ocultarFormulario() {
    this.showForm = false;
    this.editMode = false;
    this.form.reset();
    this.limpiarFormArrays();
  }

  limpiarFormArrays() {
    while (this.experienciaLaboral.length !== 0) {
      this.experienciaLaboral.removeAt(0);
    }
    while (this.educacion.length !== 0) {
      this.educacion.removeAt(0);
    }
    while (this.habilidades.length !== 0) {
      this.habilidades.removeAt(0);
    }
    while (this.idiomas.length !== 0) {
      this.idiomas.removeAt(0);
    }
    while (this.referencias.length !== 0) {
      this.referencias.removeAt(0);
    }
  }

  guardar() {
    if (this.form.valid) {
      const hojaVida = this.form.value;
      
      if (!this.editMode) {
        this.api.create(hojaVida).subscribe(() => {
          this.cargar();
          this.ocultarFormulario();
        });
      } else {
        this.api.update(this.idEdit, hojaVida).subscribe(() => {
          this.editMode = false;
          this.cargar();
          this.ocultarFormulario();
        });
      }
    }
  }

  editar(hojaVida: HojaVida) {
    this.editMode = true;
    this.idEdit = hojaVida._id!;
    this.showForm = true;
    
    // Llenar el formulario con los datos existentes
    this.form.patchValue({
      usuarioId: hojaVida.usuarioId,
      datosPersonales: hojaVida.datosPersonales,
      perfilProfesional: hojaVida.perfilProfesional
    });

    // Llenar arrays
    this.llenarExperiencias(hojaVida.experienciaLaboral);
    this.llenarEducacion(hojaVida.educacion);
    this.llenarHabilidades(hojaVida.habilidades);
    this.llenarIdiomas(hojaVida.idiomas);
    this.llenarReferencias(hojaVida.referencias);
  }

  private llenarExperiencias(experiencias: ExperienciaLaboral[]) {
    this.limpiarFormArrays();
    experiencias.forEach(exp => {
      const expForm = this.fb.group({
        empresa: [exp.empresa],
        cargo: [exp.cargo],
        fechaInicio: [exp.fechaInicio],
        fechaFin: [exp.fechaFin],
        descripcion: [exp.descripcion],
        esTrabajoActual: [exp.esTrabajoActual]
      });
      this.experienciaLaboral.push(expForm);
    });
  }

  private llenarEducacion(educaciones: Educacion[]) {
    educaciones.forEach(edu => {
      const eduForm = this.fb.group({
        institucion: [edu.institucion],
        titulo: [edu.titulo],
        fechaInicio: [edu.fechaInicio],
        fechaFin: [edu.fechaFin],
        descripcion: [edu.descripcion],
        enCurso: [edu.enCurso]
      });
      this.educacion.push(eduForm);
    });
  }

  private llenarHabilidades(habilidades: string[]) {
    habilidades.forEach(hab => {
      this.habilidades.push(this.fb.control(hab));
    });
  }

  private llenarIdiomas(idiomas: Idioma[]) {
    idiomas.forEach(idioma => {
      const idiomaForm = this.fb.group({
        idioma: [idioma.idioma],
        nivel: [idioma.nivel]
      });
      this.idiomas.push(idiomaForm);
    });
  }

  private llenarReferencias(referencias: Referencia[]) {
    referencias.forEach(ref => {
      const refForm = this.fb.group({
        nombre: [ref.nombre],
        cargo: [ref.cargo],
        empresa: [ref.empresa],
        telefono: [ref.telefono],
        email: [ref.email]
      });
      this.referencias.push(refForm);
    });
  }

  eliminar(id: string) {
    if (confirm('¿Está seguro de eliminar esta hoja de vida?')) {
      this.api.delete(id).subscribe(() => this.cargar());
    }
  }
}