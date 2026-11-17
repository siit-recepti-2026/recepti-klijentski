import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PocetnaRoutingModule } from './pocetna-routing.module';
import { Pocetna } from './pocetna';

@NgModule({
  declarations: [Pocetna],
  imports: [CommonModule, PocetnaRoutingModule],
})
export class PocetnaModule {}
