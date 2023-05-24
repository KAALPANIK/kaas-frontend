import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnInit, HostBinding } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  tenantForm!: FormGroup;
  isSubmitted  =  false;
  successMsg = "";
  errorMsg = "";
  loading = false;
  user: any;
  //mode_disabled = false;
  //mode_value = false;
  protected_disabled = false;
  protected_value!: boolean;
  isEditHidden = false;
  tenant_details: any;
  myModal: any;
  //$ : any;

  constructor(private authService : AuthService, private router : Router, 
    private formBuilder: FormBuilder, private socialService: SocialAuthService) { 
      this.tenantForm  =  this.formBuilder.group({
        tname: ['', Validators.required],
        preferences: ['', Validators.required],
        protected: [false, Validators.required]
      });
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user')!);

    if(this.user.role == "user"){
      //this.mode_disabled = true;
      this.protected_disabled = true;
      this.isEditHidden = true;
      this.tenantForm.disable();
    }
    else {
      //this.mode_disabled = false;
      this.protected_disabled = false;
      this.isEditHidden = false;   
    }
    console.log(this.user);
    this.authService.getUsertenant(this.user)
    .pipe(first())
    .subscribe(data => {
      this.tenant_details = data;
      this.tenantForm.controls["tname"].setValue(this.tenant_details.tenant_name);
      this.tenantForm.controls["preferences"].setValue(this.tenant_details.preferences);
      this.tenantForm.controls["protected"].setValue(this.tenant_details.protected);
    });
    this.myModal = document.getElementById('tenantModal'),{
      keyboard: false
    };
  }

  get f() { return this.tenantForm.controls; }
  /*openSidebar: any;

  menuSidebar = [
    {
      link_name: "Dashboard",
      link: "/dashboard",
      icon: "bx bx-grid-alt",
      sub_menu: []
    }, {
      link_name: "Category",
      link: null,
      icon: "bx bx-collection",
      sub_menu: [
        {
          link_name: "HTML & CSS",
          link: "/html-n-css",
        }, {
          link_name: "JavaScript",
          link: "/javascript",
        }, {
          link_name: "PHP & MySQL",
          link: "/php-n-mysql",
        }
      ]
    }, {
      link_name: "Posts",
      link: null,
      icon: "bx bx-book-alt",
      sub_menu: [
        {
          link_name: "Web Design",
          link: "/posts/web-design",
        }, {
          link_name: "Login Form",
          link: "/posts/login-form",
        }, {
          link_name: "Card Design",
          link: "/posts/card-design",
        }
      ]
    }, {
      link_name: "Analytics",
      link: "/analytics",
      icon: "bx bx-pie-chart-alt-2",
      sub_menu: []
    }, {
      link_name: "Chart",
      link: "/chart",
      icon: "bx bx-line-chart",
      sub_menu: []
    }, {
      link_name: "Plugins",
      link: null,
      icon: "bx bx-plug",
      sub_menu: [
        {
          link_name: "UI Face",
          link: "/ui-face",
        }, {
          link_name: "Pigments",
          link: "/pigments",
        }, {
          link_name: "Box Icons",
          link: "/box-icons",
        }
      ]
    }, {
      link_name: "Explore",
      link: "/explore",
      icon: "bx bx-compass",
      sub_menu: []
    }, {
      link_name: "History",
      link: "/history",
      icon: "bx bx-history",
      sub_menu: []
    }, {
      link_name: "Setting",
      link: "/setting",
      icon: "bx bx-cog",
      sub_menu: []
    }
  ]
  showSubmenu(itemEl: HTMLElement) {
    itemEl.classList.toggle("showMenu");
  }*/

  logout(){
    this.authService.logout();
  }

  submit(){
    this.isSubmitted = true;
    if(this.tenantForm.invalid){
      return;
    }
    this.loading = true;
    this.authService.updateTenant(this.tenantForm.value)
    .pipe(first()).subscribe({
      next: (data) => {
       console.log(data);
       this.successMsg = data.msg;
       this.loading = false;
       setTimeout(() => {
        this.successMsg = "";
       }, 5000);
      },
        error: error => {
          this.errorMsg = error.msg;
          console.log(error.msg);
         setTimeout(() => {
          this.errorMsg = "";
         }, 5000);
          this.loading = false;
        }
    });
  }
}
