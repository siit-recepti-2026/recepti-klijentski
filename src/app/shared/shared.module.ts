import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { DijalogPotvrde } from './dijalog-potvrde/dijalog-potvrde';
import { KarticaRecepta } from './kartica-recepta/kartica-recepta';

//Zajednicke komponente koje koriste svi feature moduli
@NgModule({
  declarations: [KarticaRecepta, DijalogPotvrde],
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, MatDialogModule],
  exports: [KarticaRecepta, DijalogPotvrde],
})
export class SharedModule {}
