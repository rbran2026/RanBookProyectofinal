export interface Material {
    id?: string;
    ususario_id: string;
    cotegoria_id: string;
    titulo: string;
    autor: string;
    estado_conservacion: "Nuevo" | "Buen Estado" | "Usado Aceptable";
    tipo_intercambio: "Donación" | "Intercambio" | "Préstamo";
    disponible?: boolean;
    propietario?: string;
    categoria?: string;
}