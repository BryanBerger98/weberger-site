import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ArticleCategory } from 'src/app/models/ArticleCategory.model';
import { Subscription } from 'rxjs';
import { TrainingsCategoriesService } from 'src/app/services/trainings/trainings-categories.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Training } from 'src/app/models/Training.model';
import { TrainingsService } from 'src/app/services/trainings/trainings.service';

@Component({
  selector: 'app-admin-trainings-edit',
  templateUrl: './admin-trainings-edit.component.html',
  styleUrls: ['./admin-trainings-edit.component.css']
})
export class AdminTrainingsEditComponent implements OnInit, OnDestroy {

  training: Training;

  editTrainingForm: FormGroup;

  categories: ArticleCategory[];
  categoriesSubscription: Subscription;

  trainingThumbnail: string;

  fileIsLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private trainingsCategoriesService: TrainingsCategoriesService,
    private trainingsService: TrainingsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.initCategories();
    this.initTrainingForm();
    this.initTraining();
  }

  initTrainingForm() {
    this.editTrainingForm = this.formBuilder.group({
      title: ['', Validators.required],
      category: '',
      level: '',
      videoTime: '',
      description: '',
      url: '',
      tags: '',
      inProduction: ''
    });
  }

  initTraining() {
    const id = this.route.snapshot.params['id'];
    this.trainingsService.getSingleTraining(+id).then(
      (training: Training) => {
        this.training = training;
        this.editTrainingForm.get('title').setValue(training.title);
        this.editTrainingForm.get('category').setValue(training.category);
        this.editTrainingForm.get('level').setValue(training.level);
        this.editTrainingForm.get('videoTime').setValue(training.videoTime);
        this.editTrainingForm.get('description').setValue(training.description);
        this.editTrainingForm.get('url').setValue(training.url);
        this.editTrainingForm.get('tags').setValue(training.tags);
        this.editTrainingForm.get('inProduction').setValue(training.inProduction);
        this.trainingThumbnail = training.thumbnail;
      }
    );
  }

  initCategories() {
    this.categoriesSubscription = this.trainingsCategoriesService.categoriesSubject.subscribe(
      (categories: ArticleCategory[]) => {
        this.categories = categories;
      }
    );
    this.trainingsCategoriesService.getCategories();
    this.trainingsCategoriesService.emitCategories();
  }

  onSaveTraining() {
    const title = this.editTrainingForm.get('title').value;
    const category = this.editTrainingForm.get('category').value;
    const level = this.editTrainingForm.get('level').value;
    const videoTime = this.editTrainingForm.get('videoTime').value;
    const description = this.editTrainingForm.get('description').value;
    const url = this.editTrainingForm.get('url').value;
    const tags = this.editTrainingForm.get('tags').value;
    const inProduction = this.editTrainingForm.get('inProduction').value;
    const thumbnail = this.trainingThumbnail ? this.trainingThumbnail : '';
    const createdOn = new Date();
    const newTraining = new Training(
      title,
      category,
      level,
      videoTime,
      description,
      url,
      tags,
      inProduction,
      thumbnail,
      createdOn.toString()
      );
    if (this.route.snapshot.params['id']) {
      newTraining.createdOn = this.training.createdOn;
      this.trainingsService.updateTraining(newTraining, this.route.snapshot.params['id']);
    } else {
      this.trainingsService.createNewTraining(newTraining);
    }
    this.router.navigate(['/admin', 'dashboard']);
  }

  ngOnDestroy() {
    this.categoriesSubscription.unsubscribe();
  }

  detectFile(event) {
    this.fileIsLoading = true;
    if (this.training && this.training.thumbnail) {
      this.trainingsService.deleteFile(this.training.thumbnail);
    }
    this.trainingsService.uploadFile(event.target.files[0]).then(
      (url: string) => {
        this.trainingThumbnail = url;
        this.fileIsLoading = false;
      }
    );
  }

}
