import { Component, OnInit } from '@angular/core';
import { AuthService } from './Security/AuthService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.handleLoginCallback();
  }
}
