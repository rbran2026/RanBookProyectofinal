import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auditoria.html',
  styleUrls: ['./auditorias.css']
})
export class Auditorias implements OnInit {
  auditorias: any[] = [];
  cargando: boolean = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarAuditoria();
  }

  cargarAuditoria() {
    this.apiService.listar('auditoria').subscribe({
      next: (res: any) => {
        this.auditorias = res;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener auditoría:', err);
        this.cargando = false;
      }
    });
  }
}