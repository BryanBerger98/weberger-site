import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TrainingsCategoriesService } from 'src/app/services/trainings/trainings-categories.service';
import { Subscription } from 'rxjs';
import { ArticleCategory } from 'src/app/models/ArticleCategory.model';
import { Router } from '@angular/router';
import { Training } from 'src/app/models/Training.model';
import { TrainingsService } from 'src/app/services/trainings/trainings.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-admin-trainings',
  templateUrl: './admin-trainings.component.html',
  styleUrls: ['./admin-trainings.component.css']
})
export class AdminTrainingsComponent implements OnInit, OnDestroy {

  trainingCategoryForm: FormGroup;

  categories: ArticleCategory[];
  categoriesSubscription: Subscription;

  trainings: Training[];
  trainingsSubscription: Subscription;

  trainingDeleteForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private trainingsCategoriesService: TrainingsCategoriesService,
    private trainingsService: TrainingsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initCategoryForm();
    this.initTrainingDeleteForm();
    this.categoriesSubscription = this.trainingsCategoriesService.categoriesSubject.subscribe(
      (categories) => {
        this.categories = categories;
      }
    );
    this.trainingsCategoriesService.getCategories();
    this.trainingsCategoriesService.emitCategories();
    this.initTrainings();
  }

  initCategoryForm() {
    this.trainingCategoryForm = this.formBuilder.group({
      title: ['', Validators.required]
    });
  }

  initTrainingDeleteForm() {
    this.trainingDeleteForm = this.formBuilder.group({
      id: ['', Validators.required]
    });
  }

  initTrainings() {
    this.trainingsSubscription = this.trainingsService.trainingsSubject.subscribe(
      (trainings) => {
        this.trainings = trainings;
      }
    );
    this.trainingsService.getTrainings();
    this.trainingsService.emitTrainings();
  }

  onSaveCategory() {
    const title = this.trainingCategoryForm.get('title').value;
    const newCategory = new ArticleCategory(title);
    this.trainingsCategoriesService.createNewCategory(newCategory);
    this.trainingCategoryForm.reset();
  }

  onRemoveCategory(category) {
    this.trainingsCategoriesService.removeCategory(category);
  }

  onGoToEditTraining() {
    console.log('Go to edit training');
    this.router.navigate(['/admin', 'trainings', 'edit']);
  }

  onEditTraining(i) {
    this.router.navigate(['/admin', 'trainings', 'edit', i]);
  }

  onDeleteTraining(i) {
    this.trainingDeleteForm.get('id').setValue(i);
    $('#removeTrainingModal').modal('show');
  }

  onConfirmDeleteTraining() {
    const id = this.trainingDeleteForm.get('id').value;
    $('#removeTrainingModal').modal('hide');
    this.trainingsService.removeTraining(id);
  }

  ngOnDestroy() {
    this.categoriesSubscription.unsubscribe();
  }

}
