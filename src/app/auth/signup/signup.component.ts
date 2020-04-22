import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators ,FormBuilder } from "@angular/forms";
import { Subscription } from "rxjs";
import { MustMatch } from '../_helpers/must-match.validator';


import { AuthService } from "../auth.service";

@Component({
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  form: FormGroup;
  pwdPattern  ='(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[$@$!#^~%*?&,.<>"\'\\;:\{\\\}\\\[\\\]\\\|\\\+\\\-\\\=\\\_\\\)\\\(\\\)\\\`\\\/\\\\\\]])[A-Za-z0-9\d$@].{8,}';
  userPattern ='^(?=.{6,10}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$';
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  private authStatusSub: Subscription;

  constructor(public authService: AuthService,private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );

    this.form = this.formBuilder.group({
      email:['',[Validators.required, Validators.pattern(this.emailPattern)]],
      password:['',[Validators.required, Validators.pattern(this.pwdPattern)]],
      userName:['',[Validators.required, Validators.pattern(this.userPattern)]],
      fullName:['',[Validators.required]],
      confirmPassword: ['',[Validators.required]],
      enableDetails: new FormControl(false),
    },{
      validator: MustMatch('password', 'confirmPassword')
  });



  }

  saverange(){
    console.log(this.form.value.confirmPassword)
  }


 

  onSignup() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(this.form.value.email, this.form.value.password,
       this.form.value.userName, this.form.value.fullName);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
