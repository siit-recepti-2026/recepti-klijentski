import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Recepti } from './recepti';

const routes: Routes = [{ path: '', component: Recepti }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceptiRoutingModule {}
