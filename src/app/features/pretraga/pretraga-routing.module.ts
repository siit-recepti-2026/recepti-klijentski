import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Pretraga } from './pretraga';

const routes: Routes = [{ path: '', component: Pretraga }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PretragaRoutingModule {}
