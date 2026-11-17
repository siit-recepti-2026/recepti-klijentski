import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Notifikacije } from './notifikacije';

const routes: Routes = [{ path: '', component: Notifikacije }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotifikacijeRoutingModule {}
