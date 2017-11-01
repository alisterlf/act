import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Component({
  selector: 'act-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Acesso Soluções de Pagamento S.A. - Twitter Dashboard';
  searchquery = '';
  searchQueryHistory;
  tweetsdata;
  time;

  constructor(private http: Http) {
    this.authorize();
  }

  ngOnInit(): void {
    this.searchQueryHistory = this.getHistory();
  }

  authorize() {
    const headers = new Headers();

    headers.append('Content-Type', 'application/X-www-form-urlencoded');

    this.http
      .post('http://localhost:3000/authorize', { headers: headers })
      .subscribe(res => {
        console.log(res);
      });
  }

  search(formValue, valid) {
    if (!valid) {
      return false;
    }
    const headers = new Headers();
    const searchterm = 'query=' + formValue.searchquery;

    headers.append('Content-Type', 'application/X-www-form-urlencoded');

    this.http
      .post('http://localhost:3000/search', searchterm, { headers: headers })
      .subscribe(res => {
        this.tweetsdata = res.json().data.statuses;
      });
  }

  getHistory() {
    const headers = new Headers();
    const searchterm = 'query=' + this.searchquery;

    headers.append('Content-Type', 'application/X-www-form-urlencoded');

    this.http.get('http://localhost:3000/history').subscribe(res => {
      console.log(res.json());
      this.searchQueryHistory = res.json().data;
    });
  }
}
