import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapPageRoutingModule } from './map-routing.module'

import { MapPage } from './map.page';
import { ApolloModule } from 'apollo-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApolloModule,
  ],
  declarations: [MapPage]
})
export class MapPageModule {}
