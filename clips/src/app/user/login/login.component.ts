import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private auth: AngularFireAuth) {}
  credentials = {
    email: '',
    password: '',
  };

  showAlert = false;
  alertMsg = 'Please wait! We are loggin you in.';
  alertColor = 'blue';
  inSubmission = false;
  async login() {
    try {
      this.inSubmission = true;
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      );
      this.showAlert = true;
      this.alertMsg = 'Your cradentials are being authenticated.';
      this.alertColor = 'blue';
    } catch (error) {
      this.inSubmission = false;
      this.showAlert = true;
      this.alertMsg = 'Credential do not match.';
      this.alertColor = 'red';
      console.log(error);
      return;
    }
    this.alertColor = 'green';
    this.alertMsg = 'Success. Your are now logged in.';
    this.inSubmission = false;
  }
}
