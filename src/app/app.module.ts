import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { MaterialModule, MdInputModule } from '@angular/material';
import { FlexLayoutModule } from "@angular/flex-layout";

import { AgmCoreModule, CircleManager, GoogleMapsAPIWrapper } from 'angular2-google-maps/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BikemapComponent } from './bikemap/bikemap.component';
import { NYCBikeDataService } from "app/services/nycbike-data.service";
import { CdAutocompleteDirective } from "app/mdautocomplete/cd-autocomplete.directive";
import { CdAutocompleteComponent } from "app/mdautocomplete/cd-autocomplete.component";

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
    BikemapComponent,
    CdAutocompleteComponent,
    CdAutocompleteDirective
  ],
  entryComponents: [CdAutocompleteComponent],
  imports: [
    RouterModule.forRoot(appRoutes),
    MaterialModule.forRoot(),
    FlexLayoutModule,
    MdInputModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCjiWIew5Eeeuu68zAqgTzkUFnHdb9a98I'
    }),
  ],
  providers: [NYCBikeDataService,CircleManager,GoogleMapsAPIWrapper],
  bootstrap: [AppComponent]
})
export class AppModule { }
