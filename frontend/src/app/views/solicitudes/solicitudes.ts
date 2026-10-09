import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitudes.html',
  styleUrls: ['./solicitudes.css']
})
export class Solicitudes implements OnInit {
  solicitudes: any[] = [];
  cargando: boolean = true;
  mostrarFormulario: boolean = false;

  nuevo: any = {
    tipo: '',
    descripcion: '',
    usuario_id: 1 // ID del usuario actual
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes() {
    this.apiService.listar('solicitudes').subscribe({
      next: (res: any) => {
        this.solicitudes = res;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener solicitudes:', err);
        this.cargando = false;
      }
    });
  }

  guardarSolicitud() {
    this.apiService.crear('solicitudes', this.nuevo).subscribe({
      next: () => {
        alert('¡Solicitud creada con éxito!');
        this.mostrarFormulario = false;
        this.nuevo = { tipo: '', descripcion: '', usuario_id: 1 };
        this.cargarSolicitudes();
      },
      error: (err) => {
        console.error('Error al guardar solicitud:', err);
        alert('Hubo un error al guardar');
      }
    });
  }
}