import { Component, OnInit } from '@angular/core';
import { AdminProduction } from 'src/app/models/AdminProduction.model';
import { AdminProductionsService } from 'src/app/services/admin/admin-productions.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-single-production',
  templateUrl: './single-production.component.html',
  styleUrls: ['./single-production.component.css']
})
export class SingleProductionComponent implements OnInit {

  production: AdminProduction;

  constructor(
    private adminProductionsService: AdminProductionsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.adminProductionsService.getSingleProduction(this.route.snapshot.params['id']).then(
      (production: AdminProduction) => {
        this.production = production;
      }
    ).catch(
      (error) => {
        console.error(error);
      }
    );
  }

}
