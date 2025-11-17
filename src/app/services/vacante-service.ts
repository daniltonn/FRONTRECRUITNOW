import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VacanteService {

  private apiUri = '/api/vacante';

  httpOptions = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}

  getAllVacantes(): Observable<any> {
    return this.http.get(this.apiUri, { headers: this.httpOptions });
  }

  getOneVacante(id: any): Observable<any> {
    return this.http.get(`${this.apiUri}/${id}`, { headers: this.httpOptions });
  }

  newVacante(data: any): Observable<any> {
    return this.http.post(this.apiUri, data, { headers: this.httpOptions });
  }

  updateVacante(id: any, data: any): Observable<any> {
    return this.http.put(`${this.apiUri}/${id}`, data, { headers: this.httpOptions });
  }

  deleteVacante(id: any): Observable<any> {
    return this.http.delete(`${this.apiUri}/${id}`, { headers: this.httpOptions });
  }

}
