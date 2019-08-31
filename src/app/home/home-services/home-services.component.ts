import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminServicesService } from 'src/app/services/admin/admin-services.service';
import { AdminService } from 'src/app/models/AdminService.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-services',
  templateUrl: './home-services.component.html',
  styleUrls: ['./home-services.component.css']
})
export class HomeServicesComponent implements OnInit, OnDestroy {

  adminServices: AdminService[];
  adminServicesSubscription: Subscription;

  constructor(
    private adminServicesService: AdminServicesService
  ) { }

  ngOnInit() {
    this.initAdminServices();
  }

  initAdminServices() {
    this.adminServicesSubscription = this.adminServicesService.servicesSubject.subscribe(
      (services: AdminService[]) => {
        this.adminServices = services;
      }
    );
    this.adminServicesService.getServices();
    this.adminServicesService.emitServices();
  }

  ngOnDestroy() {
    this.adminServicesSubscription.unsubscribe();
  }

}
