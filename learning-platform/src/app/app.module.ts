import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormsModule , ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
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
import { CommonModule } from '@angular/common';
//primeng 
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { AdminControllComponent } from './admin/admin-controll/admin-controll.component';
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password.component';
import { SetPasswordComponent } from './user/set-password/set-password.component';
import { AdminCoursesComponent } from './admin/Courses/admin-courses/admin-courses.component';
import { EditCourseComponent } from './admin/Courses/edit-course/edit-course.component';
import { AdminTeacherComponent } from './admin/Teacher/admin-teacher/admin-teacher.component';
import { TeacherEditComponent } from './admin/Teacher/edit-teacher/edit-teacher.component';
import { StudentMangerComponent } from './admin/student/student-manger/student-manger.component';
import { EditStudentComponent } from './admin/student/edit-student/edit-student.component';
import { AddTeacherComponent } from './admin/Teacher/add-teacher/add-teacher.component';
import { AdminSubCategoryComponent } from './admin/sub-category/admin-sub-category/admin-sub-category.component';
import { AdminMainCategoryComponent } from './admin/main-category/admin-main-category/admin-main-category.component';
import { PaginationControlComponent } from './admin/components/pagination-control/pagination-control.component';
import { SearchBarComponent } from './admin/components/search-bar/search-bar.component';
import { PasswordInputComponent } from './admin/components/password-input/password-input.component';
import { AddCourseComponent } from './admin/Courses/add-course/add-course.component';
// PrimeNG Modules
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
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
    ForgotPasswordComponent,
    SetPasswordComponent,
    AdminCoursesComponent,
    EditCourseComponent,
    AdminTeacherComponent,
    TeacherEditComponent,
    StudentMangerComponent,
    EditStudentComponent,
    AddTeacherComponent,
    AdminSubCategoryComponent,
    AdminMainCategoryComponent,
    PaginationControlComponent,
    SearchBarComponent,
    PasswordInputComponent,
    AddCourseComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgMultiSelectDropDownModule.forRoot(),
    RouterModule,
    CommonModule, 
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MessagesModule,
    CardModule,
    DividerModule,
    ProgressSpinnerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    // PrimeNG Modules
    MultiSelectModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    FileUploadModule,
    ButtonModule,
    InputSwitchModule,
    ProgressSpinnerModule,
    MessagesModule,
    MessageModule

  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
