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
  userPattern ='(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])[A-Za-z0-9\d$@].{6,}';
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  //fullnamePattern ='(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])[A-Za-z0-9\d$@].{6,}';
  //userPattername="^(?=.*\d)(?=.*[A-Z])(?!.*[^a-zA-Z0-9])(.{8,15})$"
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
      password:['',[Validators.required,Validators.pattern(this.pwdPattern)]],
      userName:['',[Validators.required,Validators.pattern(this.userPattern)]],
      fullName:['',[Validators.required,Validators.minLength(5),Validators.maxLength(60)]],
      confirmPassword: ['',[Validators.required]],
      enableDetails: new FormControl(false),
    },{
      validator: MustMatch('password', 'confirmPassword')
  });

  }

  omit_number(e) {
    var allowedCode = [8, 13, 32, 44, 45, 46, 95,187];
    var charCode = (e.charCode) ? e.charCode : ((e.keyCode) ? e.keyCode :
        ((e.which) ? e.which : 0));
     if (charCode > 31 && (charCode < 64 || charCode > 90) &&
      (charCode < 97 || charCode > 122) &&
      (charCode < 48 || charCode > 57) &&
      (allowedCode.indexOf(charCode) == -1)) {
      e.preventDefault();  
      return false;
     }
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

onlyText(e){
  var charCode = (e.charCode) ? e.charCode : ((e.keyCode) ? e.keyCode :
  ((e.which) ? e.which : 0));
  if(!(charCode >= 65 && charCode <= 120) && (charCode != 32 && charCode != 0)) {
e.preventDefault();  
return false;
}  
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
