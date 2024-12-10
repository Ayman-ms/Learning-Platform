import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { SignupComponent } from './user/signup/signup.component';
import { LoginComponent } from './user/login/login.component';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { UpdateUserComponent } from './user/update-user/update-user.component';
import { UserInfoComponent } from './user/user-info/user-info.component';
import { AdminControllComponent } from './admin/admin-controll/admin-controll.component';
import { UserMangerComponent } from './admin/user-manger/user-manger.component';
import { EditUserComponent } from './admin/edit-user/edit-user.component';
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password.component';
import { SetPasswordComponent } from './user/set-password/set-password.component';
import { AdminCoursesComponent } from './admin/Courses/admin-courses/admin-courses.component';


const routes: Routes = [
    {
      path: '',
      component: HomeComponent
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
      path: 'sidebar',
      component: SidebarComponent
    },
    {
      path:'update',
      component:UpdateUserComponent,
      children:[
        {
          path:'info',
          component:UserInfoComponent
        }
      ]
    },
    {
      path:'admin',
      component:AdminControllComponent,
      children:[
        {
          path:'users',
          component:UserMangerComponent
        },
        {
          path:'edituser',
          component:EditUserComponent
        },
        {
          path:'courses',
          component: AdminCoursesComponent
        }
      ]
    },
    {
      path:'forgot-password',
      component:ForgotPasswordComponent
    },
    {
      path:'renew-password',
      component:SetPasswordComponent
    }
    
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
