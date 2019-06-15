import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './user/login/login.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { HomeComponent } from './home/home.component';
import { AdminProfileComponent } from './admin/admin-profile/admin-profile.component';
import { AdminSkillsComponent } from './admin/admin-skills/admin-skills.component';
import { AdminServicesComponent } from './admin/admin-services/admin-services.component';
import { AdminProductionsComponent } from './admin/admin-productions/admin-productions.component';
import { AdminCategoriesComponent } from './admin/admin-categories/admin-categories.component';
import { AdminContactComponent } from './admin/admin-contact/admin-contact.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    AdminDashboardComponent,
    HomeComponent,
    AdminProfileComponent,
    AdminSkillsComponent,
    AdminServicesComponent,
    AdminProductionsComponent,
    AdminCategoriesComponent,
    AdminContactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule.forRoot(),
    BrowserAnimationsModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
