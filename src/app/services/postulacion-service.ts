import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Postulacion, 
  PostulacionConDetalles, 
  EstadisticasPostulacion,
  EstadoPostulacion,
  Entrevista 
} from '../models/postulacion';

@Injectable({
  providedIn: 'root'
})
export class PostulacionService {
  private apiUrl = 'http://localhost:3000/api/postulaciones';

  constructor(private http: HttpClient) { }

  // CRUD básico
  getAll(): Observable<PostulacionConDetalles[]> {
    return this.http.get<PostulacionConDetalles[]>(this.apiUrl);
  }

  get(id: string): Observable<PostulacionConDetalles> {
    return this.http.get<PostulacionConDetalles>(`${this.apiUrl}/${id}`);
  }

  create(postulacion: Postulacion): Observable<Postulacion> {
    return this.http.post<Postulacion>(this.apiUrl, postulacion);
  }

  update(id: string, postulacion: Partial<Postulacion>): Observable<Postulacion> {
    return this.http.put<Postulacion>(`${this.apiUrl}/${id}`, postulacion);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Métodos específicos de postulaciones
  getByUsuario(usuarioId: string): Observable<PostulacionConDetalles[]> {
    return this.http.get<PostulacionConDetalles[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  getByVacante(vacanteId: string): Observable<PostulacionConDetalles[]> {
    return this.http.get<PostulacionConDetalles[]>(`${this.apiUrl}/vacante/${vacanteId}`);
  }

  getByEstado(estado: EstadoPostulacion): Observable<PostulacionConDetalles[]> {
    const params = new HttpParams().set('estado', estado);
    return this.http.get<PostulacionConDetalles[]>(`${this.apiUrl}/filtrar`, { params });
  }

  cambiarEstado(id: string, nuevoEstado: EstadoPostulacion, comentarios?: string): Observable<Postulacion> {
    const body = { estado: nuevoEstado, comentarios };
    return this.http.patch<Postulacion>(`${this.apiUrl}/${id}/estado`, body);
  }

  asignarPuntaje(id: string, puntaje: number, comentarios?: string): Observable<Postulacion> {
    const body = { puntaje, comentarios };
    return this.http.patch<Postulacion>(`${this.apiUrl}/${id}/puntaje`, body);
  }

  // Gestión de entrevistas
  programarEntrevista(postulacionId: string, entrevista: Entrevista): Observable<Postulacion> {
    return this.http.post<Postulacion>(`${this.apiUrl}/${postulacionId}/entrevistas`, entrevista);
  }

  actualizarEntrevista(postulacionId: string, entrevistaId: string, entrevista: Partial<Entrevista>): Observable<Postulacion> {
    return this.http.put<Postulacion>(`${this.apiUrl}/${postulacionId}/entrevistas/${entrevistaId}`, entrevista);
  }

  cancelarEntrevista(postulacionId: string, entrevistaId: string, motivo?: string): Observable<Postulacion> {
    const body = { motivo };
    return this.http.patch<Postulacion>(`${this.apiUrl}/${postulacionId}/entrevistas/${entrevistaId}/cancelar`, body);
  }

  // Documentos adicionales
  subirDocumento(postulacionId: string, archivo: File, tipo: string): Observable<Postulacion> {
    const formData = new FormData();
    formData.append('documento', archivo);
    formData.append('tipo', tipo);
    return this.http.post<Postulacion>(`${this.apiUrl}/${postulacionId}/documentos`, formData);
  }

  eliminarDocumento(postulacionId: string, documentoId: string): Observable<Postulacion> {
    return this.http.delete<Postulacion>(`${this.apiUrl}/${postulacionId}/documentos/${documentoId}`);
  }

  // Estadísticas y reportes
  getEstadisticas(): Observable<EstadisticasPostulacion> {
    return this.http.get<EstadisticasPostulacion>(`${this.apiUrl}/estadisticas`);
  }

  getEstadisticasPorVacante(vacanteId: string): Observable<EstadisticasPostulacion> {
    return this.http.get<EstadisticasPostulacion>(`${this.apiUrl}/estadisticas/vacante/${vacanteId}`);
  }

  // Filtros avanzados
  filtrarPostulaciones(filtros: {
    estado?: EstadoPostulacion;
    vacanteId?: string;
    fechaDesde?: Date;
    fechaHasta?: Date;
    puntajeMinimo?: number;
    puntajeMaximo?: number;
  }): Observable<PostulacionConDetalles[]> {
    let params = new HttpParams();
    
    Object.keys(filtros).forEach(key => {
      const value = (filtros as any)[key];
      if (value !== undefined && value !== null) {
        if (value instanceof Date) {
          params = params.set(key, value.toISOString());
        } else {
          params = params.set(key, value.toString());
        }
      }
    });

    return this.http.get<PostulacionConDetalles[]>(`${this.apiUrl}/filtrar`, { params });
  }

  // Búsqueda
  buscarPostulaciones(termino: string): Observable<PostulacionConDetalles[]> {
    const params = new HttpParams().set('q', termino);
    return this.http.get<PostulacionConDetalles[]>(`${this.apiUrl}/buscar`, { params });
  }
}