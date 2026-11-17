import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Pocetna } from './pocetna';

const routes: Routes = [{ path: '', component: Pocetna }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PocetnaRoutingModule {}
