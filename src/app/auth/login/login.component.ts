import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

import { AuthService } from "../auth.service";

@Component({
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  form: FormGroup;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.form = new FormGroup({
      userName: new FormControl(null, { validators: [Validators.required]}),
      password: new FormControl(null, { validators: [Validators.required]}),
      captcha: new FormControl('', { validators: [Validators.required]}),
    });
  }

  resolved(captchaResponse: string) {
    this.form.patchValue({
      captcha:captchaResponse
    })
    console.log("captchaResponse is",captchaResponse);
}

  onLogin() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(this.form.value.userName, this.form.value.password,this.form.value.captcha);
  }

  noSpecialCharacters(e) {
    // var allowedCode = [8, 13, 32, 44, 45, 46, 95,187];
       var charCode = (e.charCode) ? e.charCode : ((e.keyCode) ? e.keyCode :
           ((e.which) ? e.which : 0));
           if (charCode < 48 || (charCode > 57 && charCode < 65) || (charCode > 90 && charCode < 97) || charCode > 122) {
         e.preventDefault();  
         return false;
        }    
   }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
