import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

import { AdminFormaStavke } from './admin-forma-stavke';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminTabela } from './admin-tabela';
import { Admin } from './admin';

@NgModule({
  declarations: [Admin, AdminTabela, AdminFormaStavke],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
  ],
})
export class AdminModule {}
