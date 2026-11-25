import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { NotifikacijeRoutingModule } from './notifikacije-routing.module';
import { Notifikacije } from './notifikacije';

@NgModule({
  declarations: [Notifikacije],
  imports: [CommonModule, MatButtonModule, NotifikacijeRoutingModule],
})
export class NotifikacijeModule {}
