import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminSkillsService } from 'src/app/services/admin/admin-skills.service';
import { AdminSkillGroup } from 'src/app/models/AdminSkillGroup.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-skills',
  templateUrl: './home-skills.component.html',
  styleUrls: ['./home-skills.component.css']
})
export class HomeSkillsComponent implements OnInit, OnDestroy {

  adminSkillGroups: AdminSkillGroup[];
  adminSkillGroupsSubscription: Subscription;

  constructor(
    private adminSkillsService: AdminSkillsService
  ) { }

  ngOnInit() {
    this.initAdminSkills();
  }

  initAdminSkills() {
    this.adminSkillGroupsSubscription = this.adminSkillsService.skillGroupsSubject.subscribe(
      (skillGroups: AdminSkillGroup[]) => {
        this.adminSkillGroups = skillGroups;
      }
    );
    this.adminSkillsService.getSkillGroups();
    this.adminSkillsService.emitSkillGroups();
  }

  ngOnDestroy() {
    this.adminSkillGroupsSubscription.unsubscribe();
  }

}
