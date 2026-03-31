import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { DetailComponent } from './pages/detail/detail.component';
import { FormComponent } from './pages/form/form.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'nuevo', component: FormComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: ':id', component: DetailComponent },
  { path: ':id/editar', component: FormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudesRoutingModule {}
