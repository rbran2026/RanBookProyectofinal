export function usuarioActual(): any {
  try {
    return JSON.parse(localStorage.getItem('usuario') || 'null');
  } catch {
    return null;
  }
}

export function usuarioId(): number | null {
  const u = usuarioActual();
  return u?.id ?? u?.id_usuario ?? null;
}

export function esAdmin(): boolean {
  const rol = usuarioActual()?.rol;
  return rol === 'admin' || rol === 'administrador';
}

export function puedeModerar(): boolean {
  return esAdmin() || usuarioActual()?.rol === 'moderador';
}