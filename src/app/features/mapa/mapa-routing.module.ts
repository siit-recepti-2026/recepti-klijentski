import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Mapa } from './mapa';

const routes: Routes = [{ path: '', component: Mapa }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapaRoutingModule {}
