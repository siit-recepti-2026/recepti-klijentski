import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PocetnaRoutingModule } from './pocetna-routing.module';
import { Pocetna } from './pocetna';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [Pocetna],
  imports: [
    CommonModule,
    PocetnaRoutingModule,
    SharedModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
  ],
})
export class PocetnaModule {}
