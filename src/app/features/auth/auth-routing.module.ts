import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { gostGuard } from '../../core/guards/auth.guards';
import { Aktivacija } from './aktivacija/aktivacija';
import { Auth } from './auth';
import { Prijava } from './prijava/prijava';
import { Registracija } from './registracija/registracija';

const routes: Routes = [
  {
    path: '',
    component: Auth,
    canActivateChild: [gostGuard],
    children: [
      { path: 'prijava', component: Prijava, title: 'Prijava | Recepti' },
      { path: 'registracija', component: Registracija, title: 'Registracija | Recepti' },
      { path: 'aktivacija', component: Aktivacija, title: 'Aktivacija naloga | Recepti' },
      { path: '', pathMatch: 'full', redirectTo: 'prijava' },
    ],
  },
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class AuthRoutingModule {}
