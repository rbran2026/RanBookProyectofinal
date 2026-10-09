import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  
  if (token) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const usuarioJson = localStorage.getItem('usuario');
  
  if (usuarioJson) {
    const usuario = JSON.parse(usuarioJson);
    if (usuario.rol === 'admin') {
      return true;
    }
  }
  
  router.navigate(['/materiales']);
  return false;
};