import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './nav/navbar/navbar.component';
import { FooterComponent } from './nav/footer/footer.component';
import { LoginComponent } from './component/login/login.component';
import { HomeComponent } from './component/home/home.component';
import { HeroComponent } from './component/hero/hero.component';
import { CompaniesComponent } from './component/companies/companies.component';
import { MostRequestedComponent } from './component/most-requested/most-requested.component';
import { FeaturesComponent } from './component/features/features.component';
import { LastSectionComponent } from './component/last-section/last-section.component';
// import {SingupComp}

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
    LastSectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
