import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Material } from '../models/material.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private apiUrl = 'http://localhost:3000/api/materiales';

  constructor(private http: HttpClient) {}

  obtenerMateriales(search: string = '', categoria: string = ''): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.apiUrl}?search=${search}&categoria_id=${categoria}`);
  }

  crearMaterial(material: Material): Observable<any> {
    return this.http.post(this.apiUrl, material);
  }

  eliminarMaterial(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}