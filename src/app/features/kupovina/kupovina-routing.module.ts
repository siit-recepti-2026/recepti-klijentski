import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Kupovina } from './kupovina';

const routes: Routes = [{ path: '', component: Kupovina }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KupovinaRoutingModule {}
