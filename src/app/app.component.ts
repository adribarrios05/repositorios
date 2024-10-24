import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import { heart, trash } from 'ionicons/icons'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    addIcons({ trash })
  }
}
