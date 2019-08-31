import { Component, OnInit, OnDestroy } from '@angular/core';
import { Training } from '../models/Training.model';
import { Subscription } from 'rxjs';
import { TrainingsService } from '../services/trainings/trainings.service';

@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.css']
})
export class TrainingsComponent implements OnInit, OnDestroy {

  trainings: Training[];
  trainingsSubscription: Subscription;

  constructor(
    private trainingsService: TrainingsService
  ) { }

  ngOnInit() {
    this.initTrainings();
  }

  initTrainings() {
    this.trainingsSubscription = this.trainingsService.trainingsSubject.subscribe(
      (trainings: Training[]) => {
        this.trainings = trainings;
      }
    );
    this.trainingsService.getTrainings();
    this.trainingsService.emitTrainings();
  }

  ngOnDestroy() {
    this.trainingsSubscription.unsubscribe();
  }

}
