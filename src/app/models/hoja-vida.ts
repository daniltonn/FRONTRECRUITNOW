export interface HojaVida {
  _id?: string;
  usuarioId: string;
  datosPersonales: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    direccion: string;
    fechaNacimiento: Date;
    cedula: string;
  };
  perfilProfesional: string;
  experienciaLaboral: ExperienciaLaboral[];
  educacion: Educacion[];
  habilidades: string[];
  idiomas: Idioma[];
  referencias: Referencia[];
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

export interface ExperienciaLaboral {
  empresa: string;
  cargo: string;
  fechaInicio: Date;
  fechaFin?: Date;
  descripcion: string;
  esTrabajoActual: boolean;
}

export interface Educacion {
  institucion: string;
  titulo: string;
  fechaInicio: Date;
  fechaFin?: Date;
  descripcion?: string;
  enCurso: boolean;
}

export interface Idioma {
  idioma: string;
  nivel: 'Básico' | 'Intermedio' | 'Avanzado' | 'Nativo';
}

export interface Referencia {
  nombre: string;
  cargo: string;
  empresa: string;
  telefono: string;
  email: string;
}