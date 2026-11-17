import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrijaveRoutingModule } from './prijave-routing.module';
import { Prijave } from './prijave';

@NgModule({
  declarations: [Prijave],
  imports: [CommonModule, PrijaveRoutingModule],
})
export class PrijaveModule {}
