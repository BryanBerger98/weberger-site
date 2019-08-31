import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { HomeComponent } from './home/home.component';
import { AdminProductionsEditComponent } from './admin/admin-productions/admin-productions-edit/admin-productions-edit.component';
import { AdminBlogEditComponent } from './admin/admin-blog/admin-blog-edit/admin-blog-edit.component';
import { AdminTrainingsEditComponent } from './admin/admin-trainings/admin-trainings-edit/admin-trainings-edit.component';
import { TermsComponent } from './terms/terms.component';
import { TrainingsComponent } from './trainings/trainings.component';
import { HomeProductionsComponent } from './home/home-productions/home-productions.component';
import { ProductionsComponent } from './productions/productions.component';
import { SingleProductionComponent } from './productions/single-production/single-production.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'productions', component: ProductionsComponent },
  { path: 'productions/:id', component: SingleProductionComponent },
  { path: 'trainings', component: TrainingsComponent },
  { path: 'admin/dashboard', canActivate: [AuthGuardService], component: AdminDashboardComponent },
  { path: 'admin/productions/edit/:id', canActivate: [AuthGuardService], component: AdminProductionsEditComponent },
  { path: 'admin/blog/edit', canActivate: [AuthGuardService], component: AdminBlogEditComponent },
  { path: 'admin/blog/edit/:id', canActivate: [AuthGuardService], component: AdminBlogEditComponent },
  { path: 'admin/trainings/edit', canActivate: [AuthGuardService], component: AdminTrainingsEditComponent },
  { path: 'admin/trainings/edit/:id', canActivate: [AuthGuardService], component: AdminTrainingsEditComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
