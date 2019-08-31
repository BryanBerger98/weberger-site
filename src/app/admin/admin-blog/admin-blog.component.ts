import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ArticleCategory } from 'src/app/models/ArticleCategory.model';
import { ArticlesCategoriesService } from 'src/app/services/blog/articles-categories.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Article } from 'src/app/models/Article.model';
import { ArticlesService } from 'src/app/services/blog/articles.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-admin-blog',
  templateUrl: './admin-blog.component.html',
  styleUrls: ['./admin-blog.component.css']
})
export class AdminBlogComponent implements OnInit, OnDestroy {

  articleCategoryForm: FormGroup;
  articleDeleteForm: FormGroup;

  categories: ArticleCategory[];
  categoriesSubscription: Subscription;

  articles: Article[];
  articlesSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private articlesCategoriesService: ArticlesCategoriesService,
    private articlesService: ArticlesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initArticleCategoryForm();
    this.initArticleDeleteForm();
    this.categoriesSubscription = this.articlesCategoriesService.categoriesSubject.subscribe(
      (categories) => {
        this.categories = categories;
      }
    );
    this.articlesCategoriesService.getCategories();
    this.articlesCategoriesService.emitCategories();
    this.articlesSubscription = this.articlesService.articlesSubject.subscribe(
      (articles) => {
        this.articles = articles;
      }
    );
    this.articlesService.getArticles();
    this.articlesService.emitArticles();
  }

  initArticleCategoryForm() {
    this.articleCategoryForm = this.formBuilder.group({
      title: ['', Validators.required]
    });
  }

  initArticleDeleteForm() {
    this.articleDeleteForm = this.formBuilder.group({
      id: ''
    });
  }

  onSaveCategory() {
    const title = this.articleCategoryForm.get('title').value;
    const newCategory = new ArticleCategory(title);
    this.articlesCategoriesService.createNewCategory(newCategory);
    this.articleCategoryForm.reset();
  }

  onRemoveCategory(category) {
    this.articlesCategoriesService.removeCategory(category);
  }

  onGoToEditArticle() {
    this.router.navigate(['/admin', 'blog', 'edit']);
  }

  onEditArticle(i) {
    this.router.navigate(['/admin', 'blog', 'edit', i]);
  }

  onDeleteArticle(i) {
    this.articleDeleteForm.get('id').setValue(i);
    $('#removeArticleModal').modal('show');
  }

  onConfirmDeleteArticle() {
    const id = this.articleDeleteForm.get('id').value;
    $('#removeArticleModal').modal('hide');
    this.articlesService.removeArticle(id);
  }

  ngOnDestroy() {
    this.categoriesSubscription.unsubscribe();
    this.articlesSubscription.unsubscribe();
  }

}
