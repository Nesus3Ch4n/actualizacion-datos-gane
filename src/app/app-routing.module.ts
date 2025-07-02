import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularioComponent } from './shared/pages/formulario-step/formulario.component';
import { InformacionPersonalComponent } from './modules/formulario/informacion-personal/informacion-personal.component';
import { AcademicoComponent } from './modules/formulario/academico/academico.component';
import { VehiculoComponent } from './modules/formulario/vehiculo/vehiculo.component';
import { ViviendaComponent } from './modules/formulario/vivienda/vivienda.component';
import { PersonasAcargoComponent } from './modules/formulario/personas-acargo/personas-acargo.component';
import { ContactoComponent } from './modules/formulario/contacto/contacto.component';
import { DeclaracionComponent } from './modules/formulario/declaracion/declaracion.component';
import { FormularioCompletadoComponent } from './modules/formulario/declaracion/formulario-completado.component';
import { AdminPanelComponent } from './modules/admin/admin-panel.component';

const routes: Routes = [
  { path: '', component: FormularioComponent,
    children: [
      { path: '', redirectTo: 'personal', pathMatch: 'full' },
      { path: 'personal', component: InformacionPersonalComponent },
      { path: 'academico', component: AcademicoComponent },
      { path: 'vehiculo', component: VehiculoComponent },
      { path: 'vivienda', component: ViviendaComponent },
      { path: 'personas-acargo', component: PersonasAcargoComponent },
      { path: 'contacto', component: ContactoComponent },
      { path: 'declaracion', component: DeclaracionComponent },
    ]
   },
   { path: 'completado', component: FormularioCompletadoComponent },
   { path: 'admin', component: AdminPanelComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
