import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KupovinaRoutingModule } from './kupovina-routing.module';
import { Kupovina } from './kupovina';

@NgModule({
  declarations: [Kupovina],
  imports: [CommonModule, KupovinaRoutingModule],
})
export class KupovinaModule {}
