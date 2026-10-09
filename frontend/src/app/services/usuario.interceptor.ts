import { HttpInterceptorFn } from '@angular/common/http';
import { usuarioId } from './sesion';

export const usuarioInterceptor: HttpInterceptorFn = (req, next) => {
  const id = usuarioId();
  if (id) {
    req = req.clone({ setHeaders: { 'x-usuario-id': String(id) } });
  }
  return next(req);
};