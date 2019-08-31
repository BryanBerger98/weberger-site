import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditorModule } from '@tinymce/tinymce-angular';

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
import { AdminProductionsEditComponent } from './admin/admin-productions/admin-productions-edit/admin-productions-edit.component';
import { AdminBlogComponent } from './admin/admin-blog/admin-blog.component';
import { AdminBlogEditComponent } from './admin/admin-blog/admin-blog-edit/admin-blog-edit.component';
import { AdminTrainingsComponent } from './admin/admin-trainings/admin-trainings.component';
import { AdminTrainingsEditComponent } from './admin/admin-trainings/admin-trainings-edit/admin-trainings-edit.component';
import { HomeOwnerComponent } from './home/home-owner/home-owner.component';
import { HomeServicesComponent } from './home/home-services/home-services.component';
import { HomeSkillsComponent } from './home/home-skills/home-skills.component';
import { HomeProductionsComponent } from './home/home-productions/home-productions.component';
import { HomeFooterComponent } from './home/home-footer/home-footer.component';
import { TermsComponent } from './terms/terms.component';
import { TrainingsComponent } from './trainings/trainings.component';
import { ProductionsComponent } from './productions/productions.component';
import { SingleProductionComponent } from './productions/single-production/single-production.component';

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
    AdminContactComponent,
    AdminProductionsEditComponent,
    AdminBlogComponent,
    AdminBlogEditComponent,
    AdminTrainingsComponent,
    AdminTrainingsEditComponent,
    HomeOwnerComponent,
    HomeServicesComponent,
    HomeSkillsComponent,
    HomeProductionsComponent,
    HomeFooterComponent,
    TermsComponent,
    TrainingsComponent,
    ProductionsComponent,
    SingleProductionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule.forRoot(),
    BrowserAnimationsModule,
    DragDropModule,
    EditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
