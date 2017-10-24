import { Component, OnInit } from '@angular/core';
import { Http, Headers} from '@angular/http';

@Component({
  selector: 'act-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'act';
  searchquery = '';
  tweetsdata = {};

  constructor(private http: Http) { }

  ngOnInit(): void {
    this.authorize();
    const self = this;
    setTimeout(function() {
      self.searchquery = '#BagulhosSinistros';
      self.searchcall();
    }, 500);
  }

  authorize() {
    const headers = new Headers();

    headers.append('Content-Type', 'application/X-www-form-urlencoded');

    this.http.post('http://localhost:3000/authorize', {headers: headers}).subscribe((res) => {
      console.log(res);
    });
  }

  searchcall() {
    const headers = new Headers();
    const searchterm = 'query=' + this.searchquery;

    headers.append('Content-Type', 'application/X-www-form-urlencoded');

    this.http.post('http://localhost:3000/search', searchterm, {headers: headers}).subscribe((res) => {
      this.tweetsdata = res.json().data.statuses;
    });
  }
}
