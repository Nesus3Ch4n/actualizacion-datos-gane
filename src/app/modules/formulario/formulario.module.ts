import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InformacionPersonalComponent } from './informacion-personal/informacion-personal.component';
import { ViviendaComponent } from './vivienda/vivienda.component';
import { VehiculoComponent } from './vehiculo/vehiculo.component';
import { PersonasAcargoComponent } from './personas-acargo/personas-acargo.component';
import { AcademicoComponent } from './academico/academico.component';
import { ContactoComponent } from './contacto/contacto.component';
import { DeclaracionComponent } from './declaracion/declaracion.component';
import { ConfirmationModalComponent } from './declaracion/confirmation-modal.component';
import { FormularioCompletadoComponent } from './declaracion/formulario-completado.component';
import { OnlyNumbersDirective } from '../../directives/only-numbers.directive';
import { AppRoutingModule } from '../../app-routing.module';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../shared/shared.module';

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
    OnlyNumbersDirective
  ],
  imports: [
    SharedModule,
    RouterModule,
    AppRoutingModule,
    BsDatepickerModule.forRoot()
  ],
  providers: [DatePipe]
})
export class FormularioModule {
  constructor( private bsLocaleService: BsLocaleService){
    this.bsLocaleService.use('es');
  }
}
