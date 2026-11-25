import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { administratorGuard, prijavljenGuard } from './core/guards/auth.guards';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'profil',
    canActivate: [prijavljenGuard],
    loadChildren: () => import('./features/profil/profil.module').then((m) => m.ProfilModule),
  },
  {
    path: 'recepti',
    loadChildren: () => import('./features/recepti/recepti.module').then((m) => m.ReceptiModule),
  },
  {
    path: 'pocetna',
    loadChildren: () => import('./features/pocetna/pocetna.module').then((m) => m.PocetnaModule),
  },
  {
    path: 'pretraga',
    loadChildren: () => import('./features/pretraga/pretraga.module').then((m) => m.PretragaModule),
  },
  {
    path: 'prijave',
    loadChildren: () => import('./features/prijave/prijave.module').then((m) => m.PrijaveModule),
  },
  {
    path: 'evidencija',
    loadChildren: () =>
      import('./features/evidencija/evidencija.module').then((m) => m.EvidencijaModule),
  },
  {
    path: 'kupovina',
    loadChildren: () => import('./features/kupovina/kupovina.module').then((m) => m.KupovinaModule),
  },
  {
    path: 'admin',
    canActivate: [administratorGuard],
    loadChildren: () => import('./features/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'mapa',
    loadChildren: () => import('./features/mapa/mapa.module').then((m) => m.MapaModule),
  },
  {
    path: 'notifikacije',
    canActivate: [prijavljenGuard],
    loadChildren: () =>
      import('./features/notifikacije/notifikacije.module').then((m) => m.NotifikacijeModule),
  },
  { path: '', redirectTo: 'pocetna', pathMatch: 'full' },
  { path: '**', redirectTo: 'pocetna' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
