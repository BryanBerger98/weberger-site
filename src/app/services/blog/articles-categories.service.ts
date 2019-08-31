import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { ArticleCategory } from 'src/app/models/ArticleCategory.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticlesCategoriesService {

  categories: ArticleCategory[] = [];
  categoriesSubject = new Subject<ArticleCategory[]>();

  constructor() { }

  emitCategories() {
    this.categoriesSubject.next(this.categories);
  }

  saveCategories() {
    firebase.database().ref('/blog/categories').set(this.categories);
  }

  getCategories() {
    firebase.database().ref('/blog/categories').on('value', (data) => {
      this.categories = data.val() ? data.val() : [];
      this.emitCategories();
    });
  }

  getSingleCategory(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/blog/categories/' + id).once('value').then(
          (data) => {
            resolve(data.val());
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  createNewCategory(newCategory: ArticleCategory) {
    this.categories.push(newCategory);
    this.saveCategories();
    this.emitCategories();
  }

  removeCategory(category: ArticleCategory) {
    const serviceIndexToRemove = this.categories.findIndex(
      (categoryEl) => {
        if (categoryEl === category) {
          return true;
        }
      }
    );
    this.categories.splice(serviceIndexToRemove, 1);
    this.saveCategories();
    this.emitCategories();
  }
}
