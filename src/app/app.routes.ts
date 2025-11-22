import { Routes } from "@angular/router";
import { LayoutComponent } from "./components/layout/layout";
import { AuthGuard } from "./guards/auth-guard";
import { SignupComponent } from "./authentication/signup/signup";
import { LoginComponent } from "./authentication/login/login";
import { DashboardComponent } from "./components/dashboard/dashboard";
import { VacanteComponent } from "./components/vacante/vacante";
import { UsuarioComponent } from "./components/usuario/usuario";

export const routes: Routes = [

  // Rutas públicas
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // Rutas protegidas (layout incluido)
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'vacantes', component: VacanteComponent },
      { path: 'usuarios', component: UsuarioComponent },
      //agregar rutas CRUD
      
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Resto
  { path: '**', redirectTo: 'dashboard' }
];
