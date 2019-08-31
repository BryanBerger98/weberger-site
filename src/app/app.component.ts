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

    // DEV CONFIG
    const firebaseConfig = {
      apiKey: "AIzaSyDnk09jgDPuDcJIMdp4XTy2VlciytmLulo",
      authDomain: "weberger-app.firebaseapp.com",
      databaseURL: "https://weberger-app.firebaseio.com",
      projectId: "weberger-app",
      storageBucket: "weberger-app.appspot.com",
      messagingSenderId: "652777520726",
      appId: "1:652777520726:web:0a3b556a5ac055da"
    };

    // PROD CONFIG
    // const firebaseConfig = {
    //   apiKey: 'AIzaSyB_Wq-_f_tJg3GLrbo655RsBOyX6CfMLe0',
    //   authDomain: 'weberger-6f67a.firebaseapp.com',
    //   databaseURL: 'https://weberger-6f67a.firebaseio.com',
    //   projectId: 'weberger-6f67a',
    //   storageBucket: 'weberger-6f67a.appspot.com',
    //   messagingSenderId: '386889718939',
    //   appId: '1:386889718939:web:837e404cc1c531f2'
    // };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }

}
