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
import { AuthGuard } from './guards/auth.guard';
import { WelcomeComponent } from './components/welcome.component';

const routes: Routes = [
  // Ruta de bienvenida (sin autenticación)
  { path: 'welcome', component: WelcomeComponent },
  
  // Ruta principal del formulario (requiere autenticación)
  { 
    path: 'formulario', 
    component: FormularioComponent,
    canActivate: [AuthGuard],
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
   
   // Redirecciones directas a rutas del formulario (para compatibilidad)
   { path: 'personal', redirectTo: '/formulario/personal', pathMatch: 'full' },
   { path: 'academico', redirectTo: '/formulario/academico', pathMatch: 'full' },
   { path: 'vehiculo', redirectTo: '/formulario/vehiculo', pathMatch: 'full' },
   { path: 'vivienda', redirectTo: '/formulario/vivienda', pathMatch: 'full' },
   { path: 'personas-acargo', redirectTo: '/formulario/personas-acargo', pathMatch: 'full' },
   { path: 'contacto', redirectTo: '/formulario/contacto', pathMatch: 'full' },
   { path: 'declaracion', redirectTo: '/formulario/declaracion', pathMatch: 'full' },
   
   { 
     path: 'completado', 
     component: FormularioCompletadoComponent,
     canActivate: [AuthGuard]
   },
   
   { 
     path: 'admin', 
     component: AdminPanelComponent,
     canActivate: [AuthGuard]
   },
   
   // Redirigir a welcome si no hay autenticación
   { path: '', redirectTo: '/welcome', pathMatch: 'full' },
   { path: '**', redirectTo: 'welcome' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
