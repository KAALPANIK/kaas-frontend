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
  isSubmitted  =  false;
  loading = false;
  error = '';
  loggedIn !: boolean;
  user !: SocialUser;

  constructor(private authService : AuthService, 
    private router : Router, private formBuilder: FormBuilder,
    private socialService: SocialAuthService) {
    this.authForm  =  this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
  });
   }


  ngOnInit() {
    this.socialService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      console.log(user);

      if(user){
        this.router.navigate(['/dashboard']);
      }
    });
  }


  get formControls() { return this.authForm.controls; }

  /*onClickSubmit(data: any) {
    this.userName = data.userName;
    this.password = data.password;

    console.log("Login page: " + this.userName);
    console.log("Login page: " + this.password);

    /*this.authService.login(this.userName, this.password)
       .subscribe( data => { 
          console.log("Is Login Success: " + data); 
    
         if(data) this.router.navigate(['/expenses']); 
    });*/
 //}

 signIn(){
  this.isSubmitted = true;
  if(this.authForm.invalid){
    return;
  }
  this.error = '';
  this.loading = true;
  //this.authService.signIn(this.authForm.value);
  //this.router.navigateByUrl('/admin');
  console.log(this.authForm.get('email')?.value);
  console.log(this.authForm.get('password')?.value);

  this.authService.login(this.authForm.value)
    .pipe(first())
    .subscribe({
        next: () => {
            // get return url from route parameters or default to '/'
            //const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            this.router.navigate(['/dashboard']);
        },
        error: error => {
            this.error = error.error;
            this.loading = false;
        }
    });
}
}
