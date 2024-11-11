import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule , ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

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
import { UpdateUserComponent } from './user/update-user/update-user.component';
import { UserSidebarComponent } from './user/sidebar/sidebar.component';
import { UserInfoComponent } from './user/user-info/user-info.component';

//primeng 
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { AdminControllComponent } from './admin/admin-controll/admin-controll.component';
import { UserMangerComponent } from './admin/user-manger/user-manger.component';
import { EditUserComponent } from './admin/edit-user/edit-user.component';
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password.component';
import { SetPasswordComponent } from './user/set-password/set-password.component';


export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
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
    SignupComponent,
    UpdateUserComponent,
    UserSidebarComponent,
    UserInfoComponent,
    AdminControllComponent,
    UserMangerComponent,
    EditUserComponent,
    ForgotPasswordComponent,
    SetPasswordComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MessagesModule,
    CardModule,
    DividerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
    
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
