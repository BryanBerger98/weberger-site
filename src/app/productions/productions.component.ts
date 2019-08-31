import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminProduction } from '../models/AdminProduction.model';
import { Subscription } from 'rxjs';
import { AdminProductionsService } from '../services/admin/admin-productions.service';

@Component({
  selector: 'app-productions',
  templateUrl: './productions.component.html',
  styleUrls: ['./productions.component.css']
})
export class ProductionsComponent implements OnInit, OnDestroy {

  adminProductions: AdminProduction[];
  adminProductionsSubscription: Subscription;

  constructor(
    private adminProductionsService: AdminProductionsService
  ) { }

  ngOnInit() {
    this.initAdminProductions();
  }

  initAdminProductions() {
    this.adminProductionsSubscription = this.adminProductionsService.productionsSubject.subscribe(
      (productions: AdminProduction[]) => {
        this.adminProductions = productions;
      }
    );
    this.adminProductionsService.getProductions();
    this.adminProductionsService.emitProductions();
  }

  ngOnDestroy() {
    this.adminProductionsSubscription.unsubscribe();
  }

}
