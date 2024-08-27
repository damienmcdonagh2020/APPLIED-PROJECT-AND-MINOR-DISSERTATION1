import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DataDisplayPageRoutingModule } from './data-display-routing.module';

import { DataDisplayPage } from './data-display.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicModule.forRoot(),
    DataDisplayPageRoutingModule
  ],
  declarations: [DataDisplayPage]
})
export class DataDisplayPageModule {}
