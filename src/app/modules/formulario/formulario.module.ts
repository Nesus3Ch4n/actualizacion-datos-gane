import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { InformacionPersonalComponent } from './informacion-personal/informacion-personal.component';
import { ViviendaComponent } from './vivienda/vivienda.component';
import { VehiculoComponent } from './vehiculo/vehiculo.component';
import { PersonasAcargoComponent } from './personas-acargo/personas-acargo.component';
import { AcademicoComponent } from './academico/academico.component';
import { ContactoComponent } from './contacto/contacto.component';
import { DeclaracionComponent } from './declaracion/declaracion.component';
import { ConfirmationModalComponent } from './declaracion/confirmation-modal.component';
import { FormularioCompletadoComponent } from './declaracion/formulario-completado.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormularioComponent } from '../../shared/pages/formulario-step/formulario.component';
import { OnlyNumbersDirective } from 'src/app/only-numbers.directive';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale, esLocale } from 'ngx-bootstrap/chronos';
import { MaterialModule } from '../../shared/material.module';

defineLocale('es', esLocale);

@NgModule({
  declarations: [
    InformacionPersonalComponent,
    ViviendaComponent,
    VehiculoComponent,
    PersonasAcargoComponent,
    AcademicoComponent,
    ContactoComponent,
    DeclaracionComponent,
    ConfirmationModalComponent,
    FormularioCompletadoComponent,
    FormularioComponent,
    OnlyNumbersDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BsDatepickerModule.forRoot(),
    MaterialModule
  ],
  providers: [DatePipe],
})
export class FormularioModule {
  constructor( private bsLocaleService: BsLocaleService){
    this.bsLocaleService.use('es');
  }
}
