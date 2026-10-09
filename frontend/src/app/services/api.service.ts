import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  listar(recurso: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/${recurso}`);
  }
  crear(recurso: string, datos: any): Observable<any> {
    return this.http.post<any>(`${this.base}/${recurso}`, datos);
  }
  actualizar(recurso: string, datos: any): Observable<any> {
    return this.http.patch<any>(`${this.base}/${recurso}`, datos);
  }
  eliminar(recurso: string): Observable<any> {
    return this.http.delete<any>(`${this.base}/${recurso}`);
  }
}