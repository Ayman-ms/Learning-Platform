import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { SignupComponent } from './user/signup/signup.component';
import { LoginComponent } from './user/login/login.component';
import { SidebarComponent } from './admin/sidebar/sidebar.component';

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
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
