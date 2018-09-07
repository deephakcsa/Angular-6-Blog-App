import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  posts: any = [];
  isOverlayVisible: boolean = false;

  constructor(private _http: HttpClient) { }

  ngOnInit() {
    this._http.get('http://localhost:9797/getposts').subscribe((res: any) => {
      if (res.status) {
        this.posts = res.docs;
      } else {
        alert(res.err);
      }
    });
  }

  delete(id) {
    var obj = { 'id': id };
    this._http.post('http://localhost:9797/deletepost/', obj).subscribe((res: any) => {
      if (res.status) {
        this._http.get('http://localhost:9797/getposts').subscribe((res: any) => {
          if (res.status) {
            this.posts = res.docs;
          } else {
            alert(res.err);
          }
        });
      } else {
        alert(res.err);
      }
    });
  }

  like(id) {
    var obj = { 'id': id };
    this._http.post('http://localhost:9797/addlike/', obj).subscribe((res: any) => {
      if (res.status) {
        this._http.get('http://localhost:9797/getposts').subscribe((res: any) => {
          if (res.status) {
            this.posts = res.docs;
          } else {
            alert(res.err);
          }
        });
      } else {
        alert(res.err);
      }
    });
  }

  onActivate(e) {
    this.isOverlayVisible = !this.isOverlayVisible;
  }

  onDeactivate(e) {
    this._http.get('http://localhost:9797/getposts').subscribe((res: any) => {
      if (res.status) {
        this.posts = res.docs;
      } else {
        alert(res.err);
      }
    });
    this.isOverlayVisible = !this.isOverlayVisible;
  }

}
