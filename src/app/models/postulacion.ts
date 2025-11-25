export interface Postulacion {
  _id?: string;
  usuarioId: string;
  vacanteId: string;
  hojaVidaId: string;
  estado: EstadoPostulacion;
  fechaPostulacion: Date;
  fechaActualizacion?: Date;
  comentarios?: string;
  puntaje?: number;
  entrevistas?: Entrevista[];
  documentosAdicionales?: DocumentoAdicional[];
  motivacion?: string;
  salarioEsperado?: number;
  disponibilidad: DisponibilidadPostulante;
}

export interface Entrevista {
  _id?: string;
  tipo: TipoEntrevista;
  fecha: Date;
  hora: string;
  modalidad: ModalidadEntrevista;
  ubicacion?: string;
  enlaceVirtual?: string;
  entrevistador: string;
  estado: EstadoEntrevista;
  comentarios?: string;
  puntaje?: number;
  duracionEstimada: number; // en minutos
}

export interface DocumentoAdicional {
  _id?: string;
  nombre: string;
  tipo: TipoDocumento;
  url: string;
  fechaSubida: Date;
  tamaño: number; // en bytes
}

export interface DisponibilidadPostulante {
  fechaInicioDisponible: Date;
  modalidadTrabajo: ModalidadTrabajo[];
  horarioPreferido: HorarioTrabajo;
  disponibilidadViajes: boolean;
  disponibilidadCambioResidencia: boolean;
}

export enum EstadoPostulacion {
  PENDIENTE = 'PENDIENTE',
  EN_REVISION = 'EN_REVISION',
  PRESELECCIONADO = 'PRESELECCIONADO',
  ENTREVISTA_PROGRAMADA = 'ENTREVISTA_PROGRAMADA',
  ENTREVISTA_COMPLETADA = 'ENTREVISTA_COMPLETADA',
  FINALISTA = 'FINALISTA',
  CONTRATADO = 'CONTRATADO',
  RECHAZADO = 'RECHAZADO',
  RETIRADO = 'RETIRADO'
}

export enum TipoEntrevista {
  TELEFONICA = 'TELEFONICA',
  PRESENCIAL = 'PRESENCIAL',
  VIRTUAL = 'VIRTUAL',
  TECNICA = 'TECNICA',
  PSICOLOGICA = 'PSICOLOGICA',
  GRUPAL = 'GRUPAL',
  FINAL = 'FINAL'
}

export enum ModalidadEntrevista {
  PRESENCIAL = 'PRESENCIAL',
  VIRTUAL = 'VIRTUAL',
  TELEFONICA = 'TELEFONICA'
}

export enum EstadoEntrevista {
  PROGRAMADA = 'PROGRAMADA',
  CONFIRMADA = 'CONFIRMADA',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA',
  REPROGRAMADA = 'REPROGRAMADA'
}

export enum TipoDocumento {
  CV = 'CV',
  CARTA_PRESENTACION = 'CARTA_PRESENTACION',
  CERTIFICADO = 'CERTIFICADO',
  PORTAFOLIO = 'PORTAFOLIO',
  REFERENCIAS = 'REFERENCIAS',
  OTRO = 'OTRO'
}

export enum ModalidadTrabajo {
  PRESENCIAL = 'PRESENCIAL',
  REMOTO = 'REMOTO',
  HIBRIDO = 'HIBRIDO'
}

export enum HorarioTrabajo {
  TIEMPO_COMPLETO = 'TIEMPO_COMPLETO',
  MEDIO_TIEMPO = 'MEDIO_TIEMPO',
  POR_HORAS = 'POR_HORAS',
  FLEXIBLE = 'FLEXIBLE'
}

// Interfaces para DTOs y respuestas
export interface PostulacionConDetalles extends Postulacion {
  usuario?: {
    nombre: string;
    email: string;
  };
  vacante?: {
    titulo: string;
    empresa: string;
  };
  hojaVida?: {
    datosPersonales: {
      nombre: string;
      apellido: string;
      email: string;
    };
  };
}

export interface EstadisticasPostulacion {
  totalPostulaciones: number;
  porEstado: { [key in EstadoPostulacion]: number };
  promedioTiempoRespuesta: number;
  tasaConversion: number;
}