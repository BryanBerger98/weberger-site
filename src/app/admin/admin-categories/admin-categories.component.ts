import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminCategory } from 'src/app/models/AdminCategory.model';
import { Subscription } from 'rxjs';
import { AdminCategoriesService } from 'src/app/services/admin/admin-categories.service';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.css']
})
export class AdminCategoriesComponent implements OnInit, OnDestroy {

  categories: AdminCategory[];
  categorySubscription: Subscription;

  adminSkillForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private adminCategoriesService: AdminCategoriesService
  ) { }

  ngOnInit() {
    this.initAdminSkillForm();
    this.categorySubscription = this.adminCategoriesService.categoriesSubject.subscribe(
      (categories: AdminCategory[]) => {
        this.categories = categories;
      }
    );
    this.adminCategoriesService.getCategories();
    this.adminCategoriesService.emitCategories();
  }

  initAdminSkillForm() {
    this.adminSkillForm = this.formBuilder.group({
      title: ['', Validators.required]
    });
  }

  onSaveSkill() {
    const title = this.adminSkillForm.get('title').value;
    const newCategory = new AdminCategory(title);
    this.adminCategoriesService.createNewCategory(newCategory);
    this.adminSkillForm.reset();
  }

  onDeleteCategory(category: AdminCategory) {
    this.adminCategoriesService.removeCategory(category);
  }

  ngOnDestroy() {
    this.categorySubscription.unsubscribe();
  }

}
