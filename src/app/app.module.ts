import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthguardGuard } from './auth/authguard.guard';
import { RegisterComponent } from './register/register.component';
import { CreatepostComponent } from './createpost/createpost.component';
import { PostsComponent } from './posts/posts.component';
import { AuthinterceptorService } from './auth/authinterceptor.service';
import { CommentsComponent } from './comments/comments.component';
import { EditpostComponent } from './editpost/editpost.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    CreatepostComponent,
    PostsComponent,
    CommentsComponent,
    EditpostComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent, canActivate: [AuthguardGuard] },
      { path: 'create', component: CreatepostComponent, canActivate: [AuthguardGuard] },
      {
        path: 'posts', component: PostsComponent, canActivate: [AuthguardGuard],
        children: [
          { path: 'editpost/:id', component: EditpostComponent, canActivate: [AuthguardGuard], outlet:'editpost' },
          { path: "", redirectTo: "posts", pathMatch: "full" }
        ]
      },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: "", redirectTo: "home", pathMatch: "full" },
      { path: "**", redirectTo: "home" }
    ]),
  ],
  providers: [AuthService, CookieService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthinterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
