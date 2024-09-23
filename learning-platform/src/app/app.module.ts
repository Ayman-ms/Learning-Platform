import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule , ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './nav/navbar/navbar.component';
import { FooterComponent } from './nav/footer/footer.component';
import { LoginComponent } from './user/login/login.component';
import { HomeComponent } from './component/home/home.component';
import { HeroComponent } from './component/hero/hero.component';
import { CompaniesComponent } from './component/companies/companies.component';
import { MostRequestedComponent } from './component/most-requested/most-requested.component';
import { FeaturesComponent } from './component/features/features.component';
import { LastSectionComponent } from './component/last-section/last-section.component';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { SignupComponent } from './user/signup/signup.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    HomeComponent,
    HeroComponent,
    CompaniesComponent,
    MostRequestedComponent,
    FeaturesComponent,
    LastSectionComponent,
    SidebarComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
