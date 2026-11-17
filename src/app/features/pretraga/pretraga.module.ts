import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PretragaRoutingModule } from './pretraga-routing.module';
import { Pretraga } from './pretraga';

@NgModule({
  declarations: [Pretraga],
  imports: [CommonModule, PretragaRoutingModule],
})
export class PretragaModule {}
