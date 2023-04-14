import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  isSubmitted  =  false;
  loading = false;
  error = '';
  tenants: any;

  constructor(private authService : AuthService, 
    private router : Router, private formBuilder: FormBuilder) {
    this.signupForm  =  this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      tenant: ['', Validators.required]
  }); }

  ngOnInit() {
    this.authService.tenant().pipe(first())
    .subscribe( data => {
      this.tenants = data;
    });
  }
  get formControls() { return this.signupForm.controls; }
  signup(){
    this.isSubmitted = true;
    if(this.signupForm.invalid){
      return;
    }
    this.error = '';
    this.loading = true;
  
    this.authService.signup(this.signupForm.value)
      .pipe(first())
      .subscribe({
          next: () => {
              // get return url from route parameters or default to '/'
              //const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
              this.router.navigate(['/login']);
          },
          error: error => {
            console.log(error.error.msg);
              this.error = error.error.msg;
              this.loading = false;
          }
      });
  }
}
