import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  adminSignInForm: FormGroup;
  errorMessage: string;
  validateCaptcha: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  resolved(captchaResponse: string) {
    // console.log(`Resolved captcha with response ${captchaResponse}:`);
    this.validateCaptcha = true;
    console.log(this.validateCaptcha);
  }

  initForm() {
    this.adminSignInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z{6,}]/)]],
      recaptchaReactive: [this.validateCaptcha, Validators.required]
    });
  }

  onSubmit() {
    const email = this.adminSignInForm.get('email').value;
    const password = this.adminSignInForm.get('password').value;

    if (this.validateCaptcha === true) {
      this.authenticationService.signInUser(email, password).then(
        () => {
          // this.router.navigate(['/admin', 'dashboard']);
          console.log('Logged in')
        },
        (error) => {
          this.errorMessage = error;
        }
      );
    } else {
      alert('Merci de remplir le captcha');
    }
  }

}
