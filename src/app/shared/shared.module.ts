import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { KarticaRecepta } from './kartica-recepta/kartica-recepta';

//Zajednicke komponente koje koriste svi feature moduli
@NgModule({
  declarations: [KarticaRecepta],
  imports: [CommonModule, RouterModule, MatCardModule],
  exports: [KarticaRecepta],
})
export class SharedModule {}
