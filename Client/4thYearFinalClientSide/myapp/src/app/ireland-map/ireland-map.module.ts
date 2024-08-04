import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IrelandMapPageRoutingModule } from './ireland-map-routing.module';

import { IrelandMapPage } from './ireland-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IrelandMapPageRoutingModule
  ],
  declarations: [IrelandMapPage]
})
export class IrelandMapPageModule {}
