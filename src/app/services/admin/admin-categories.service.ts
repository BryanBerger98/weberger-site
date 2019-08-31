import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AdminCategory } from 'src/app/models/AdminCategory.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminCategoriesService {

  categories: AdminCategory[] = [];
  categoriesSubject = new Subject<AdminCategory[]>();

  constructor() { }

  emitCategories() {
    this.categoriesSubject.next(this.categories);
  }

  saveCategories() {
    firebase.database().ref('/categories').set(this.categories);
  }

  getCategories() {
    firebase.database().ref('/categories').on('value', (data) => {
      this.categories = data.val() ? data.val() : [];
      this.emitCategories();
    });
  }

  getSingleCategory(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/categories/' + id).once('value').then(
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

  createNewCategory(newCategory: AdminCategory) {
    this.categories.push(newCategory);
    this.saveCategories();
    this.emitCategories();
  }

  removeCategory(category: AdminCategory) {
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
