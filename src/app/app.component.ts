import { Component } from '@angular/core';
import { MdInputModule, MdSidenav, MdSnackBar, MdSnackBarConfig, MdAutocompleteModule } from '@angular/material';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MdSnackBar, MdSidenav, MdInputModule]
})
export class AppComponent {
  slideToggleModel = true;

}
