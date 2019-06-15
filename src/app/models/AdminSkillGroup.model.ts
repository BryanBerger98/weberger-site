import { AdminSkill } from './AdminSkill.model';

export class AdminSkillGroup {
    constructor(public id: string, public title: string, public skills: AdminSkill[]) {}
}