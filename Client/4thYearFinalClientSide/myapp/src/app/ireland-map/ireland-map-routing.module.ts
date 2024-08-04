import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IrelandMapPage } from './ireland-map.page';

const routes: Routes = [
  {
    path: '',
    component: IrelandMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IrelandMapPageRoutingModule {}
