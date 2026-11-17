import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapaRoutingModule } from './mapa-routing.module';
import { Mapa } from './mapa';

@NgModule({
  declarations: [Mapa],
  imports: [CommonModule, MapaRoutingModule],
})
export class MapaModule {}
