import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceptiRoutingModule } from './recepti-routing.module';
import { Recepti } from './recepti';

@NgModule({
  declarations: [Recepti],
  imports: [CommonModule, ReceptiRoutingModule],
})
export class ReceptiModule {}
