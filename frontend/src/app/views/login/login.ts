import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterLink, FormsModule, CommonModule],
    templateUrl: "./login.html",
    styleUrls: ["./login.css"]
})

export class Login {
    email = " ";
    password = " ";
    mensajeError = "";

    constructor(private router: Router, private http: HttpClient) {}

    IniciarSesion(){
        this.http.post<any>("http://localhgost:3000/api/auth/login",{
            email: this.email,
            password: this.password
        }).subscribe({
            next: (respuesta)=> {
                localStorage.setItem("usuario", JSON.stringify(respuesta.usuario));

                const rol = respuesta.usuario.rol || respuesta.usuario.rol;

                if (rol === "admin" || rol === "administrador"){
                    this.router.navigate(["/admin-home"]);
                } else{
                    this.router.navigate(["/home"]);
                }
            },
            error: (error) => {
                this.mensajeError = error.error?.mensaje || "Error al iniciar sesión.";
            }
        });
    }
}

