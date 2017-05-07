import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { MaterialModule, MdInputModule } from '@angular/material';
import { FlexLayoutModule } from "@angular/flex-layout";

import { AgmCoreModule, CircleManager, GoogleMapsAPIWrapper } from 'angular2-google-maps/core';

import { ChartsModule } from 'ng2-charts/ng2-charts';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BikemapComponent } from './bikemap/bikemap.component';
import { NYCBikeDataService } from "app/services/nycbike-data.service";
import { CdAutocompleteDirective } from "app/mdautocomplete/cd-autocomplete.directive";
import { CdAutocompleteComponent } from "app/mdautocomplete/cd-autocomplete.component";
import { DashboardComponent } from './dashboard/dashboard.component';
import { SortPipe } from "app/pipes/sortPipe";

const appRoutes: Routes = [
  {
    path: 'map',
    component: BikemapComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  //{ path: '**', component: AppComponent }
];
@NgModule({
  declarations: [
    AppComponent,
    BikemapComponent,
    CdAutocompleteComponent,
    CdAutocompleteDirective,
    DashboardComponent,
    SortPipe,
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
    ChartsModule,
  ],
  providers: [NYCBikeDataService, CircleManager, GoogleMapsAPIWrapper],
  bootstrap: [AppComponent]
})
export class AppModule { }
