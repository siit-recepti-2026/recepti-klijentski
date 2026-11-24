import {
  NgModule,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppRoutingModule } from './app-routing.module';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AuthService } from './core/services/auth.service';
import { App } from './app.component';

@NgModule({
  declarations: [App],
  imports: [BrowserModule, AppRoutingModule, MatButtonModule, MatToolbarModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([authInterceptor])),
    //Pri otvaranju aplikacije osvezava se token prijavljenog korisnika (ne ceka se odgovor)
    provideAppInitializer(() => inject(AuthService).osveziSesiju()),
  ],
  bootstrap: [App],
})
export class AppModule {}
