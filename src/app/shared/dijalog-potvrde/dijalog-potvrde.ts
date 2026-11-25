import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface PodaciDijalogaPotvrde {
  naslov: string;
  poruka: string;
  tekstPotvrde?: string;
}

@Component({
  selector: 'app-dijalog-potvrde',
  standalone: false,
  templateUrl: './dijalog-potvrde.html',
})
export class DijalogPotvrde {
  protected readonly podaci = inject<PodaciDijalogaPotvrde>(MAT_DIALOG_DATA);
}
