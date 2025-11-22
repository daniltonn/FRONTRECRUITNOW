export interface Jwtres {
  datosUsuario: {
    id: number,
    usuario: string,
    correo: string,
    clave: string,
    access_token: string,
    expiresIn: string
  }
}