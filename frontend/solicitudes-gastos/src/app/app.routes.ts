import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: 'solicitudes', loadChildren: () => import('./features/solicitudes/solicitudes-routing.module').then(m => m.SolicitudesRoutingModule) },
	{ path: 'dashboard', redirectTo: 'solicitudes/dashboard', pathMatch: 'full' },
	{ path: '', redirectTo: 'solicitudes', pathMatch: 'full' }
];
