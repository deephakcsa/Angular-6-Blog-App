import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  authForm : any = {};

  constructor(private _authService:AuthService) { }

  ngOnInit() {
  }

  login(){
    this._authService.login(this.authForm);
  }

}
