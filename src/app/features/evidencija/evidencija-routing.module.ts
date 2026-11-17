import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Evidencija } from './evidencija';

const routes: Routes = [{ path: '', component: Evidencija }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvidencijaRoutingModule {}
