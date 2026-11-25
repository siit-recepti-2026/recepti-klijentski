import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { ProfilRoutingModule } from './profil-routing.module';
import { Profil } from './profil';
import { IzmenaProfila } from './izmena-profila/izmena-profila';

@NgModule({
  declarations: [Profil, IzmenaProfila],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ProfilRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
})
export class ProfilModule {}
