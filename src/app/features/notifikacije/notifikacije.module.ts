import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotifikacijeRoutingModule } from './notifikacije-routing.module';
import { Notifikacije } from './notifikacije';

@NgModule({
  declarations: [Notifikacije],
  imports: [CommonModule, NotifikacijeRoutingModule],
})
export class NotifikacijeModule {}
