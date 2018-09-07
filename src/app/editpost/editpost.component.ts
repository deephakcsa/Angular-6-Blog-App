import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-editpost',
  templateUrl: './editpost.component.html',
  styleUrls: ['./editpost.component.css']
})
export class EditpostComponent implements OnInit {

  post:any = {};

  constructor(private _router:Router, private _activatedRoute:ActivatedRoute, private _http:HttpClient) { }

  ngOnInit() {
    this._activatedRoute.params.subscribe((id)=>{
      this._http.get('http://localhost:9797/getpost' + '?id=' + encodeURIComponent(id.id)).subscribe((res: any) => {
        if (res.status) {
          this.post = res.docs[0];
        } else {
          alert(res.err);
        }
      });
    });
  }

  save(){
    this._http.post('http://localhost:9797/editpost',this.post).subscribe((res:any)=>{
      if(res.status){

      }else{
        alert(res.err);
      }
      this._router.navigate(['posts']);
    });
  }

  cancel(){
    this._router.navigate(['posts']);
  }

}
