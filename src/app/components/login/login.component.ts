import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from  '../../models/user';
import { first } from 'rxjs';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-google-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  authForm: FormGroup;
  pwdResetForm: FormGroup;
  isSubmitted  =  false;
  resetSubmitted  =  false;
  loading = false;
  successMsg = "";
  error = '';
  emailMsg = '';
  loggedIn !: boolean;
  user !: SocialUser;

  constructor(private authService : AuthService, private router : Router, 
    private formBuilder: FormBuilder, private socialService: SocialAuthService) {

    this.authForm  =  this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.pwdResetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

   }


  ngOnInit() {
    this.socialService.authState.subscribe((user) => {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      this.loggedIn = (user != null);
      const user_details = {
        username: user.name,
        email: user.email,
        password: "",
        tenant: "",
        login_type: 'google'
      }

      this.authService.verifySocialUser(user_details)
      .pipe(first())
      .subscribe(data=> {
          if(data.status == 200){
            this.router.navigate(['/dashboard']);
          }
          else {
            this.authService.signup(user_details)
            .pipe(first())
            .subscribe(response => {
                  // get return url from route parameters or default to '/'
                  //const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                  if(response.status == 200){
                    this.successMsg = "Signup Successful";
                    setTimeout(() => {
                      this.router.navigate(['/dashboard']);
                      }, 4000);
                  }
                  else {
                    this.error = response.error;
                    this.loading = false;
                  }
            });
          }
        });
    });
  }


  get formControls() { return this.authForm.controls; }
  get f() { return this.pwdResetForm.controls; }

 signIn(){
  this.isSubmitted = true;
  if(this.authForm.invalid){
    return;
  }
  this.error = '';
  this.loading = true;

  this.authService.login(this.authForm.value)
    .pipe(first())
    .subscribe({
        next: () => {
            // get return url from route parameters or default to '/'
            //const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            this.router.navigate(['/dashboard']);
        },
        error: error => {
          console.log(error);
          // if(error.status != 404){
          //   this.error = error.msg;
          // }
          // else
          this.error = error.error.msg;
          this.loading = false;
        }
    });
}

reset(){
  this.resetSubmitted = true;
  if(this.pwdResetForm.invalid){
    return;
  }
  this.emailMsg = '';

  this.authService.generatePasswordLink(this.pwdResetForm.value)
  .pipe(first())
  .subscribe({
      next: () => {
          //this.router.navigate(['/dashboard']);
          this.emailMsg = "Password reset link sent to your mail id"
      },
      error: error => {
          this.emailMsg = error.msg;
          this.loading = false;
      }
  });
}
}
