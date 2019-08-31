import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import * as firebase from 'firebase';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ArticleCategory } from 'src/app/models/ArticleCategory.model';
import { Subscription } from 'rxjs';
import { ArticlesCategoriesService } from 'src/app/services/blog/articles-categories.service';
import { Article } from 'src/app/models/Article.model';
import { ArticlesService } from 'src/app/services/blog/articles.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-blog-edit',
  templateUrl: './admin-blog-edit.component.html',
  styleUrls: ['./admin-blog-edit.component.css']
})
export class AdminBlogEditComponent implements OnInit {

  article: Article;

  editArticleForm: FormGroup;

  categories: ArticleCategory[];
  categoriesSubscription: Subscription;

  articleThumbnail: string;

  constructor(
    private formBuilder: FormBuilder,
    private articleCategoriesService: ArticlesCategoriesService,
    private articlesService: ArticlesService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.initArticle();
    this.initEditArticleForm();
    this.initCategories();
  }

  initEditArticleForm() {
    this.editArticleForm = this.formBuilder.group({
      title: ['', Validators.required],
      category: '',
      content: '',
      tags: ''
    });
  }

  initArticle() {
    const id = this.route.snapshot.params['id'];
    this.articlesService.getSingleArticle(+id).then(
      (article: Article) => {
        this.article = article;
        this.editArticleForm.get('title').setValue(article.title);
        this.editArticleForm.get('category').setValue(article.category);
        this.editArticleForm.get('content').setValue(article.content);
        this.editArticleForm.get('tags').setValue(article.tags);
        this.articleThumbnail = article.thumbnail;
      }
    );
  }

  public editorConfig = {
    height: 500,
    plugins: [
      "advlist autolink lists link image charmap print preview anchor",
      "searchreplace visualblocks code fullscreen",
      "insertdatetime media table paste imagetools wordcount"
    ],
    toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
    content_css: [
      '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
      '//www.tiny.cloud/css/codepen.min.css'
    ],
    images_upload_handler: function (blobInfo, success, failure) {
      console.log(blobInfo.blob());
      this.articlesService.uploadFile(blobInfo.blob()).then(
        (url: string) => {
          success(url);
        }
      )
    }.bind(this),
   };

  initCategories() {
    this.categoriesSubscription = this.articleCategoriesService.categoriesSubject.subscribe(
      (categories: ArticleCategory[]) => {
        this.categories = categories;
      }
    );
    this.articleCategoriesService.getCategories();
    this.articleCategoriesService.emitCategories();
  }

  onSaveArticle() {
    const title = this.editArticleForm.get('title').value;
    const category = this.editArticleForm.get('category').value;
    const content = this.editArticleForm.get('content').value;
    const tags = this.editArticleForm.get('tags').value;
    const thumbnail = this.articleThumbnail ? this.articleThumbnail : '';
    const date = new Date();
    const newArticle = new Article(title, category, content, tags, thumbnail, date.toString());
    if (this.route.snapshot.params['id']) {
      newArticle.date = this.article.date;
      this.articlesService.updateArticle(newArticle, this.route.snapshot.params['id']);
    } else {
      this.articlesService.createNewArticle(newArticle);
    }
    this.router.navigate(['/admin', 'dashboard']);
  }

  detectFile(event) {
    if (this.article && this.article.thumbnail) {
      this.articlesService.deleteFile(this.article.thumbnail);
    }
    this.articlesService.uploadFile(event.target.files[0]).then(
      (url: string) => {
        this.articleThumbnail = url;
      }
    );
  }

}
