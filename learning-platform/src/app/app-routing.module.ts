import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { SignupComponent } from './user/signup/signup.component';
import { LoginComponent } from './user/login/login.component';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { UpdateUserComponent } from './user/update-user/update-user.component';
import { UserInfoComponent } from './user/user-info/user-info.component';
import { AdminControllComponent } from './admin/admin-controll/admin-controll.component';
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password.component';
import { SetPasswordComponent } from './user/set-password/set-password.component';
import { AdminCoursesComponent } from './admin/Courses/admin-courses/admin-courses.component';
import { StudentMangerComponent } from './admin/student/student-manger/student-manger.component';
import { EditStudentComponent } from './admin/student/edit-student/edit-student.component';
import { AdminTeacherComponent } from './admin/Teacher/admin-teacher/admin-teacher.component';
import { TeacherEditComponent } from './admin/Teacher/edit-teacher/edit-teacher.component';
import { AddTeacherComponent } from './admin/Teacher/add-teacher/add-teacher.component';
import { AdminMainCategoryComponent } from './admin/main-category/admin-main-category/admin-main-category.component';
import { AdminSubCategoryComponent } from './admin/sub-category/admin-sub-category/admin-sub-category.component';
import { EditCourseComponent } from './admin/Courses/edit-course/edit-course.component';
import { AddCourseComponent } from './admin/Courses/add-course/add-course.component';
import { AllCoursesComponent } from './courses/all-courses/all-courses.component';
import { CourseDetailsComponent } from './courses/course-details/course-details.component';
import { AboutComponent } from './component/about/about.component';
import { ContactComponent } from './component/contact/contact.component';
import { MyCoursesComponent } from './user/my-courses/my-courses.component';
import { AdminGuard } from './authenticate-guard';
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'register',
    component: SignupComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'sidebar',
    component: SidebarComponent
  },
  {
    path: 'update',
    component: UpdateUserComponent,
    children: [
      {
        path: 'info',
        component: UserInfoComponent
      },
      {
        path: 'my-cources',
        component: MyCoursesComponent
      }
    ]
  },
  {
    path: 'admin',
    component: AdminControllComponent,
    canActivate: [AdminGuard],
    children: [
      { path: 'students', component: StudentMangerComponent },
      { path: 'editstudent', component: EditStudentComponent },
      { path: 'teachers', component: AdminTeacherComponent },
      { path: 'courses', component: AdminCoursesComponent },
      { path: 'courses/new-courses', component: AddCourseComponent },
      { path: 'editcourse/:id', component: EditCourseComponent },
      { path: 'editteacher/:id', component: TeacherEditComponent },
      { path: 'addteacher', component: AddTeacherComponent },
      { path: 'maincategory', component: AdminMainCategoryComponent },
      { path: 'subcategory', component: AdminSubCategoryComponent },
      { path: '', redirectTo: 'students', pathMatch: 'full' }
    ]
  },
  {
    path: 'all-courses',
    component: AllCoursesComponent
  },
  {
    path: 'course/:id',
    component: CourseDetailsComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'renew-password',
    component: SetPasswordComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
