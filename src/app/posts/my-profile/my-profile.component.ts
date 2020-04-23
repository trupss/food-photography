import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { JwtHelperService } from '@auth0/angular-jwt';


import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { AuthService } from "../../auth/auth.service";
import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel';


@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  comment:any;
  userName:any;
  decodedToken:any;
  myPosts:any=[]
  fullName:string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const helper = new JwtHelperService();
    let token = localStorage.getItem("token");
   if(token!=null && token !='' && token !=undefined){
    this.decodedToken = helper.decodeToken(token);
    this.fullName=this.decodedToken.fullName;
    this.userName = this.decodedToken.fullName;
    console.log(this.decodedToken);
      }
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: any; postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
        this.myPosts=[];
        for(var i=0;i<this.posts.length;i++){
          if(this.userId==this.posts[i].creator){
            this.myPosts.push(this.posts[i]);
          }
        }

      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onlyText(e){
    var charCode = (e.charCode) ? e.charCode : ((e.keyCode) ? e.keyCode :
    ((e.which) ? e.which : 0));
    if(!(charCode >= 65 && charCode <= 120) && (charCode != 32 && charCode != 0)) {
  e.preventDefault();  
  return false;
  }  
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  onComment(postId:string){
  if(this.comment!==null && this.comment){
    this.postsService.addcomments(postId,this.comment,1).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
      this.comment='';
    }, () => {
      this.isLoading = false;
    });
  }
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

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
