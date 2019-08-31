import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminProductionsService } from 'src/app/services/admin/admin-productions.service';
import { AdminProduction } from 'src/app/models/AdminProduction.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-productions',
  templateUrl: './home-productions.component.html',
  styleUrls: ['./home-productions.component.css']
})
export class HomeProductionsComponent implements OnInit, OnDestroy {

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
