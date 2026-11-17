import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvidencijaRoutingModule } from './evidencija-routing.module';
import { Evidencija } from './evidencija';

@NgModule({
  declarations: [Evidencija],
  imports: [CommonModule, EvidencijaRoutingModule],
})
export class EvidencijaModule {}
