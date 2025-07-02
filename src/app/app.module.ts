import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormularioModule } from './modules/formulario/formulario.module';
import { AdminModule } from './modules/admin/admin.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationContainerComponent } from './components/notification-container.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormularioModule,
    AdminModule,
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule,
    NotificationContainerComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
