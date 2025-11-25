import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { PostulacionService } from '../../services/postulacion-service';
import { 
  Postulacion, 
  PostulacionConDetalles, 
  EstadoPostulacion, 
  TipoEntrevista,
  ModalidadEntrevista,
  EstadoEntrevista,
  TipoDocumento,
  ModalidadTrabajo,
  HorarioTrabajo,
  Entrevista
} from '../../models/postulacion';

@Component({
  standalone: true,
  selector: 'app-postulacion',
  templateUrl: './postulacion.html',
  styleUrls: ['./postulacion.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class PostulacionComponent implements OnInit {

  postulaciones: PostulacionConDetalles[] = [];
  form!: FormGroup;
  entrevistaForm!: FormGroup;
  editMode = false;
  idEdit = '';
  showForm = false;
  showEntrevistaModal = false;
  selectedPostulacion: PostulacionConDetalles | null = null;
  filtroEstado: EstadoPostulacion | '' = '';
  terminoBusqueda = '';

  // Enums para templates
  EstadoPostulacion = EstadoPostulacion;
  TipoEntrevista = TipoEntrevista;
  ModalidadEntrevista = ModalidadEntrevista;
  EstadoEntrevista = EstadoEntrevista;
  TipoDocumento = TipoDocumento;
  ModalidadTrabajo = ModalidadTrabajo;
  HorarioTrabajo = HorarioTrabajo;

  // Arrays para selects
  estadosPostulacion = Object.values(EstadoPostulacion);
  tiposEntrevista = Object.values(TipoEntrevista);
  modalidadesEntrevista = Object.values(ModalidadEntrevista);
  estadosEntrevista = Object.values(EstadoEntrevista);
  tiposDocumento = Object.values(TipoDocumento);
  modalidadesTrabajo = Object.values(ModalidadTrabajo);
  horariosTrabajo = Object.values(HorarioTrabajo);

  constructor(
    private api: PostulacionService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.initEntrevistaForm();
    this.cargar();
  }

  initForm() {
    this.form = this.fb.group({
      usuarioId: ['', Validators.required],
      vacanteId: ['', Validators.required],
      hojaVidaId: ['', Validators.required],
      estado: [EstadoPostulacion.PENDIENTE, Validators.required],
      comentarios: [''],
      puntaje: ['', [Validators.min(0), Validators.max(100)]],
      motivacion: [''],
      salarioEsperado: ['', [Validators.min(0)]],
      disponibilidad: this.fb.group({
        fechaInicioDisponible: ['', Validators.required],
        modalidadTrabajo: [[], Validators.required],
        horarioPreferido: ['', Validators.required],
        disponibilidadViajes: [false],
        disponibilidadCambioResidencia: [false]
      })
    });
  }

  initEntrevistaForm() {
    this.entrevistaForm = this.fb.group({
      tipo: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      modalidad: ['', Validators.required],
      ubicacion: [''],
      enlaceVirtual: [''],
      entrevistador: ['', Validators.required],
      estado: [EstadoEntrevista.PROGRAMADA, Validators.required],
      comentarios: [''],
      puntaje: ['', [Validators.min(0), Validators.max(100)]],
      duracionEstimada: [60, [Validators.required, Validators.min(15)]]
    });
  }

  cargar() {
    this.api.getAll().subscribe((data: PostulacionConDetalles[]) => {
      this.postulaciones = data;
    });
  }

  filtrarPorEstado() {
    if (this.filtroEstado) {
      this.api.getByEstado(this.filtroEstado).subscribe((data: PostulacionConDetalles[]) => {
        this.postulaciones = data;
      });
    } else {
      this.cargar();
    }
  }

  buscar() {
    if (this.terminoBusqueda.trim()) {
      this.api.buscarPostulaciones(this.terminoBusqueda).subscribe((data: PostulacionConDetalles[]) => {
        this.postulaciones = data;
      });
    } else {
      this.cargar();
    }
  }

  mostrarFormulario() {
    this.showForm = true;
    this.editMode = false;
    this.form.reset();
    this.form.patchValue({
      estado: EstadoPostulacion.PENDIENTE,
      disponibilidad: {
        modalidadTrabajo: [],
        horarioPreferido: HorarioTrabajo.TIEMPO_COMPLETO,
        disponibilidadViajes: false,
        disponibilidadCambioResidencia: false
      }
    });
  }

  ocultarFormulario() {
    this.showForm = false;
    this.editMode = false;
    this.form.reset();
  }

  guardar() {
    if (this.form.valid) {
      const postulacion = this.form.value;
      postulacion.fechaPostulacion = new Date();
      
      if (!this.editMode) {
        this.api.create(postulacion).subscribe(() => {
          this.cargar();
          this.ocultarFormulario();
        });
      } else {
        this.api.update(this.idEdit, postulacion).subscribe(() => {
          this.editMode = false;
          this.cargar();
          this.ocultarFormulario();
        });
      }
    }
  }

  editar(postulacion: PostulacionConDetalles) {
    this.editMode = true;
    this.idEdit = postulacion._id!;
    this.showForm = true;
    
    this.form.patchValue({
      usuarioId: postulacion.usuarioId,
      vacanteId: postulacion.vacanteId,
      hojaVidaId: postulacion.hojaVidaId,
      estado: postulacion.estado,
      comentarios: postulacion.comentarios,
      puntaje: postulacion.puntaje,
      motivacion: postulacion.motivacion,
      salarioEsperado: postulacion.salarioEsperado,
      disponibilidad: postulacion.disponibilidad
    });
  }

  eliminar(id: string) {
    if (confirm('¿Está seguro de eliminar esta postulación?')) {
      this.api.delete(id).subscribe(() => this.cargar());
    }
  }

  cambiarEstado(postulacion: PostulacionConDetalles, nuevoEstado: EstadoPostulacion) {
    const comentarios = prompt('Comentarios (opcional):');
    this.api.cambiarEstado(postulacion._id!, nuevoEstado, comentarios || undefined)
      .subscribe(() => this.cargar());
  }

  asignarPuntaje(postulacion: PostulacionConDetalles) {
    const puntajeStr = prompt('Ingrese el puntaje (0-100):');
    if (puntajeStr) {
      const puntaje = parseInt(puntajeStr);
      if (puntaje >= 0 && puntaje <= 100) {
        const comentarios = prompt('Comentarios (opcional):');
        this.api.asignarPuntaje(postulacion._id!, puntaje, comentarios || undefined)
          .subscribe(() => this.cargar());
      } else {
        alert('El puntaje debe estar entre 0 y 100');
      }
    }
  }

  // Gestión de entrevistas
  mostrarModalEntrevista(postulacion: PostulacionConDetalles) {
    this.selectedPostulacion = postulacion;
    this.showEntrevistaModal = true;
    this.entrevistaForm.reset();
    this.entrevistaForm.patchValue({
      estado: EstadoEntrevista.PROGRAMADA,
      duracionEstimada: 60
    });
  }

  ocultarModalEntrevista() {
    this.showEntrevistaModal = false;
    this.selectedPostulacion = null;
    this.entrevistaForm.reset();
  }

  programarEntrevista() {
    if (this.entrevistaForm.valid && this.selectedPostulacion) {
      const entrevista: Entrevista = this.entrevistaForm.value;
      this.api.programarEntrevista(this.selectedPostulacion._id!, entrevista)
        .subscribe(() => {
          this.cargar();
          this.ocultarModalEntrevista();
        });
    }
  }

  cancelarEntrevista(postulacion: PostulacionConDetalles, entrevistaId: string) {
    const motivo = prompt('Motivo de cancelación:');
    if (motivo) {
      this.api.cancelarEntrevista(postulacion._id!, entrevistaId, motivo)
        .subscribe(() => this.cargar());
    }
  }

  // Utilidades
  getEstadoClass(estado: EstadoPostulacion): string {
    const clases: { [key in EstadoPostulacion]: string } = {
      [EstadoPostulacion.PENDIENTE]: 'badge-warning',
      [EstadoPostulacion.EN_REVISION]: 'badge-info',
      [EstadoPostulacion.PRESELECCIONADO]: 'badge-primary',
      [EstadoPostulacion.ENTREVISTA_PROGRAMADA]: 'badge-secondary',
      [EstadoPostulacion.ENTREVISTA_COMPLETADA]: 'badge-light',
      [EstadoPostulacion.FINALISTA]: 'badge-success',
      [EstadoPostulacion.CONTRATADO]: 'badge-success',
      [EstadoPostulacion.RECHAZADO]: 'badge-danger',
      [EstadoPostulacion.RETIRADO]: 'badge-dark'
    };
    return clases[estado] || 'badge-secondary';
  }

  getPuntajeClass(puntaje?: number): string {
    if (!puntaje) return 'text-muted';
    if (puntaje >= 80) return 'text-success';
    if (puntaje >= 60) return 'text-warning';
    return 'text-danger';
  }

  formatearFecha(fecha: Date | string): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  formatearFechaHora(fecha: Date | string): string {
    return new Date(fecha).toLocaleString('es-ES');
  }

  onModalidadTrabajoChange(event: any) {
    const modalidad = event.target.value;
    const modalidades = this.form.get('disponibilidad.modalidadTrabajo')?.value || [];
    
    if (event.target.checked) {
      if (!modalidades.includes(modalidad)) {
        modalidades.push(modalidad);
      }
    } else {
      const index = modalidades.indexOf(modalidad);
      if (index > -1) {
        modalidades.splice(index, 1);
      }
    }
    
    this.form.get('disponibilidad.modalidadTrabajo')?.setValue(modalidades);
  }

  isModalidadSelected(modalidad: ModalidadTrabajo): boolean {
    const modalidades = this.form.get('disponibilidad.modalidadTrabajo')?.value || [];
    return modalidades.includes(modalidad);
  }
}