import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataDisplayPage } from './data-display.page';

const routes: Routes = [
  {
    path: '',
    component: DataDisplayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataDisplayPageRoutingModule {}
