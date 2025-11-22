import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VacanteService {

  private apiUri = '/api/vacante';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get(this.apiUri);
  }

  get(id: string) {
    return this.http.get(`${this.apiUri}/${id}`);
  }

  create(data: any) {
    return this.http.post(this.apiUri, data);
  }

  update(id: string, data: any) {
    return this.http.put(`${this.apiUri}/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUri}/${id}`);
  }
}
