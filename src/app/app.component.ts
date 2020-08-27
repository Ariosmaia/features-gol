import { Component } from '@angular/core';
import {UiStyleToggleService} from "./services/ui-style-toggle.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor(private uiStyleToggleService: UiStyleToggleService) {
  }

  toggleTheme() {
    this.uiStyleToggleService.toggle();
  }
}
