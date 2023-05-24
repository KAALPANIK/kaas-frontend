import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  isSubmitted  =  false;
  loading = false;
  error = '';
  message = '';
  resetLink = "";
  pwd_match = '';
  passwordsMatching = false;
  isConfirmPasswordDirty = false;
  confirmPasswordClass = 'form-control';
  showPassword = false;

  newPassword = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
    Validators.required,
  ]);
  confirmPassword = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
    Validators.required,
  ]);


  constructor(private authService : AuthService, private route: ActivatedRoute,
    private router : Router, private formBuilder: FormBuilder) {
      // this.route.params.subscribe(params => {
      //   this.resetLink = params['token'];
      //   console.log(this.resetLink);
      //  // this.VerifyToken();
      // });
     }
  resetPasswordForm = this.formBuilder.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword,
    },
    {
      validator: this.ConfirmedValidator('newPassword', 'confirmPassword'),
    }
  );
  ngOnInit() {
  }

  get formControls() { return this.resetPasswordForm.controls; }

  // VerifyToken() {
  //   this.authService.verifyPasswordToken({ resetLink: this.resetLink }).pipe(first()).subscribe({
  //     next: () => {
  //       this.message = 'Verified';
  //     },
  //     error: error => {
  //       this.message = error;
  //   }
  //   });
  // }

  onSubmit() {
    this.isSubmitted = true;
    if (this.resetPasswordForm.invalid) {
      console.log("error");
      this.pwd_match = "Passwords do not match";
      return;
    }
    else {
      this.error = '';
      this.loading = true;
      console.log("passwords match");
      //if passwords match send data to backend
      this.authService.resetPassword(this.resetPasswordForm.value)
    .pipe(first())
    .subscribe({
        next: (result) => {
          console.log(result);
            // get return url from route parameters or default to '/'
            //const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            this.error = result.msg;
            //this.router.navigate(['/login']);
        },
        error: error => {
          console.log(error);
            this.error = error.msg;
            this.loading = false;
        }
    });
    }
  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
