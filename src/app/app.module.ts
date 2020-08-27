import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UiStyleToggleService } from './services/ui-style-toggle.service';
import { StorageService } from './services/local-storage.service';

import {DailySelectionModule} from './daily-selection/daily-selection.module';
import {WeeklySelectionModule} from './weekly-selection/weekly-selection.module';



export function themeFactory(themeService: UiStyleToggleService) {
  return () => themeService.setThemeOnStart();
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DailySelectionModule,
    WeeklySelectionModule,

  ],
  providers: [
    UiStyleToggleService,
    StorageService,
    {provide: APP_INITIALIZER, useFactory: themeFactory, deps: [UiStyleToggleService], multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
