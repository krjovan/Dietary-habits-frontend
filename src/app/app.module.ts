import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './services/auth-interceptor.service';


import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { AuthGuardService } from './services/auth-guard.service';
import { RegisterComponent } from './components/register/register.component';
import { UsersComponent } from './components/users/users.component';
import { AdminAuthGuardService } from './services/admin-auth-guard.service';
import { NutritionComponent } from './components/nutrition/nutrition.component';
import { SearchAndAddNutritionComponent } from './components/search-and-add-nutrition/search-and-add-nutrition.component';
import { MyDietComponent } from './components/my-diet/my-diet.component';
import { MyDriComponent } from './components/my-dri/my-dri.component';
import { StatsComponent } from './components/stats/stats.component';
import { CreateFoodComponent } from './components/create-food/create-food.component';
import { SimpleFoodCreationComponent } from './components/simple-food-creation/simple-food-creation.component';
import { CompositeFoodCreationComponent } from './components/composite-food-creation/composite-food-creation.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'users', component: UsersComponent, canActivate: [AdminAuthGuardService] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'nutrition', component: NutritionComponent, canActivate: [AdminAuthGuardService] },
  { path: 'search-add', component: SearchAndAddNutritionComponent, canActivate: [AuthGuardService] },
  { path: 'my-diet', component: MyDietComponent, canActivate: [AuthGuardService] },
  { path: 'my-dri', component: MyDriComponent, canActivate: [AuthGuardService] },
  { path: 'stats', component: StatsComponent, canActivate: [AuthGuardService] },
  { path: 'create-food', component: CreateFoodComponent, canActivate: [AuthGuardService] },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    SignInComponent,
    RegisterComponent,
    UsersComponent,
    NutritionComponent,
    SearchAndAddNutritionComponent,
    MyDietComponent,
    MyDriComponent,
    StatsComponent,
    CreateFoodComponent,
    SimpleFoodCreationComponent,
    CompositeFoodCreationComponent
  ],
  imports: [
    BrowserModule,
	  BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    FormsModule,
    HttpClientModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-center',
      closeButton: true,
      preventDuplicates: true
    })
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptcha.siteKey,
      } as RecaptchaSettings,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
