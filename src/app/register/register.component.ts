import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user : any = {};

  constructor(private _authService:AuthService) { }

  ngOnInit() {
  }

  register(data, valid) : void {
    if(valid) {
      this._authService.register(data);
    }
  }

}
