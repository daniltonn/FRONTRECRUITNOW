import { Routes } from '@angular/router';
import { VacanteComponent } from './components/vacante/vacante';

export const routes: Routes = [
  { path: 'vacantes', component: VacanteComponent },
  { path: '', redirectTo: 'vacantes', pathMatch: 'full' }
];
