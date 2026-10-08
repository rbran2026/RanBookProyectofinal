export interface Usuario {
    id?: number;
    nombre: string;
    email: string;
    rol: "admin" | "usuario";
    institucion?: string;
    ciudad: string;
}