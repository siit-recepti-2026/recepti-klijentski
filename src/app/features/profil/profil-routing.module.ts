import { NgModule, inject } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Profil } from './profil';

const routes: Routes = [
  //"/profil" bez korisnickog imena vodi na profil prijavljenog korisnika.
  //Preusmerenje se izvrsava pre guard-a, pa neprijavljen korisnik ovde ide na prijavu.
  {
    path: '',
    pathMatch: 'full',
    redirectTo: () => {
      const router = inject(Router);
      const korisnickoIme = inject(AuthService).korisnickoIme();
      return korisnickoIme
        ? router.createUrlTree(['/profil', korisnickoIme])
        : router.createUrlTree(['/auth/prijava'], { queryParams: { povratak: '/profil' } });
    },
  },
  { path: ':korisnickoIme', component: Profil },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilRoutingModule {}
