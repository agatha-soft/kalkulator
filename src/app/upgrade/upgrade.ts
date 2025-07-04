import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import 'firebase/auth';

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.html',
  styleUrls: ['./upgrade.css'],
  standalone: false // This is not a standalone component, so we set this to false
})
export class Upgrade implements OnInit {

  ngOnInit(): void {
    const uiConfig = {
      signInSuccessUrl: '/',
      signInOptions: [
        //firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      tosUrl: '<your-tos-url>',
      privacyPolicyUrl: '<your-privacy-policy-url>'
    };

    //const ui = new firebaseui.auth.AuthUI(firebase.auth());
    //ui.start('#firebaseui-auth-container', uiConfig);
  }

  initiatePayment() {
    // TODO: Call Firebase Cloud Function to create a Stripe Checkout session
  }

}
