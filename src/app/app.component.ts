import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor() {
    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyDnk09jgDPuDcJIMdp4XTy2VlciytmLulo",
      authDomain: "weberger-app.firebaseapp.com",
      databaseURL: "https://weberger-app.firebaseio.com",
      projectId: "weberger-app",
      storageBucket: "weberger-app.appspot.com",
      messagingSenderId: "652777520726",
      appId: "1:652777520726:web:0a3b556a5ac055da"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }

}
