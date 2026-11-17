import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Prijave } from './prijave';

const routes: Routes = [{ path: '', component: Prijave }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrijaveRoutingModule {}
