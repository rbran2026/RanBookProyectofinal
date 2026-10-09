import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- IMPORTANTE PARA EL FORMULARIO
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-material',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- AÑÁDELO AQUÍ TAMBIÉN
  templateUrl: './materiales.html',
  styleUrls: ['./materiales.css']
})
export class Materiales implements OnInit {
  materiales: any[] = [];
  cargando: boolean = true;
  
  // Controla si el formulario se muestra o se oculta
  mostrarFormulario: boolean = false; 

  // Objeto que guardará los datos que escriba el usuario
  nuevo: any = {
    titulo: '',
    descripcion: '',
    estado: 'Disponible',
    usuario_id: 1,      // ID del admin o usuario actual
    categoria_id: 1     // ID de categoría por defecto
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarMateriales();
  }

  cargarMateriales() {
    this.apiService.listar('materiales').subscribe({
      next: (res: any) => {
        this.materiales = res;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener materiales:', err);
        this.cargando = false;
      }
    });
  }

  // FUNCIÓN PARA GUARDAR USANDO TU SERVICIO GENÉRICO
  guardarMaterial() {
    this.apiService.crear('materiales', this.nuevo).subscribe({
      next: (res) => {
        alert('¡Material creado con éxito!');
        this.mostrarFormulario = false; // Ocultar formulario
        this.nuevo = { titulo: '', descripcion: '', estado: 'Disponible', usuario_id: 1, categoria_id: 1 }; // Limpiar campos
        this.cargarMateriales(); // Recargar la lista automáticamente
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        alert('Hubo un error al guardar el material');
      }
    });
  }
}