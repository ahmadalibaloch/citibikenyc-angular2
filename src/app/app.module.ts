import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from "@angular/flex-layout";

import { AgmCoreModule } from 'angular2-google-maps/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BikemapComponent } from './bikemap/bikemap.component';
import { NYCBikeDataService } from "app/services/nycbike-data.service";
const appRoutes: Routes = [
  {
    path: 'map',
    component: BikemapComponent
  },
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full'
  },
  //{ path: '**', component: AppComponent }
];
@NgModule({
  declarations: [
    AppComponent,
    BikemapComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    MaterialModule.forRoot(),
    FlexLayoutModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCjiWIew5Eeeuu68zAqgTzkUFnHdb9a98I'
    })
  ],
  providers: [NYCBikeDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
