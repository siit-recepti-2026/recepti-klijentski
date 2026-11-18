import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Auth } from './auth';
import { Registracija } from './registracija/registracija';

const routes: Routes = [
  {
    path: '',
    component: Auth,
    children: [
      { path: 'registracija', component: Registracija, title: 'Registracija | Recepti' },
      { path: '', pathMatch: 'full', redirectTo: 'registracija' },
    ],
  },
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class AuthRoutingModule {}
