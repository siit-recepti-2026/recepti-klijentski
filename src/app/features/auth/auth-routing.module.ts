import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Aktivacija } from './aktivacija/aktivacija';
import { Auth } from './auth';
import { Registracija } from './registracija/registracija';

const routes: Routes = [
  {
    path: '',
    component: Auth,
    children: [
      { path: 'registracija', component: Registracija, title: 'Registracija | Recepti' },
      { path: 'aktivacija', component: Aktivacija, title: 'Aktivacija naloga | Recepti' },
      { path: '', pathMatch: 'full', redirectTo: 'registracija' },
    ],
  },
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class AuthRoutingModule {}
