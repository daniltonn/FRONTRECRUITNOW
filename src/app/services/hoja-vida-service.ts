import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HojaVida } from '../models/hoja-vida';

@Injectable({
  providedIn: 'root'
})
export class HojaVidaService {
  private apiUrl = 'http://localhost:3000/api/hoja-vida';

  constructor(private http: HttpClient) { }

  getAll(): Observable<HojaVida[]> {
    return this.http.get<HojaVida[]>(this.apiUrl);
  }

  get(id: string): Observable<HojaVida> {
    return this.http.get<HojaVida>(`${this.apiUrl}/${id}`);
  }

  getByUsuario(usuarioId: string): Observable<HojaVida> {
    return this.http.get<HojaVida>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  create(hojaVida: HojaVida): Observable<HojaVida> {
    return this.http.post<HojaVida>(this.apiUrl, hojaVida);
  }

  update(id: string, hojaVida: HojaVida): Observable<HojaVida> {
    return this.http.put<HojaVida>(`${this.apiUrl}/${id}`, hojaVida);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}