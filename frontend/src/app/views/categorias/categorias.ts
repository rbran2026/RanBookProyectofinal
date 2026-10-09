import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.html',
  styleUrls: ['./categorias.css']
})
export class Categorias implements OnInit {
  categorias: any[] = [];
  cargando: boolean = true;
  mostrarFormulario: boolean = false;

  nuevo: any = {
    nombre: ''
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.apiService.listar('categorias').subscribe({
      next: (res: any) => {
        this.categorias = res;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener categorías:', err);
        this.cargando = false;
      }
    });
  }

  guardarCategoria() {
    this.apiService.crear('categorias', this.nuevo).subscribe({
      next: () => {
        alert('¡Categoría creada con éxito!');
        this.mostrarFormulario = false;
        this.nuevo = { nombre: '' };
        this.cargarCategorias();
      },
      error: (err) => {
        console.error('Error al guardar categoría:', err);
        alert('Hubo un error al guardar');
      }
    });
  }
}