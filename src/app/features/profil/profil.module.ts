import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfilRoutingModule } from './profil-routing.module';
import { Profil } from './profil';

@NgModule({
  declarations: [Profil],
  imports: [CommonModule, ProfilRoutingModule],
})
export class ProfilModule {}
