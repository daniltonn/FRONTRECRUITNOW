import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostulacionService {

  private apiUrl = '/api/postulacion';

  constructor(private http: HttpClient) {}

  // Obtener todas las postulaciones
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Filtrar por usuario
  getByUsuario(usuarioId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?usuario=${usuarioId}`);
  }

  // Filtrar por vacante
  getByVacante(vacanteId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?vacante=${vacanteId}`);
  }

  // Crear postulación
  create(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // Actualizar estado (PUT real del backend)
  update(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  // Eliminar
  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
