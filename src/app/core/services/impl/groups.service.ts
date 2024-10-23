// src/app/services/impl/people.service.ts
import { Injectable, Inject } from '@angular/core';
import { BaseService } from './base-service.service';
import { IPeopleService } from '../interfaces/people-service.interface';
import { Person } from '../../models/person.model';
import { GROUPS_REPOSITORY_TOKEN, PEOPLE_REPOSITORY_TOKEN } from '../../repositories/repository.tokens';
import { IPeopleRepository } from '../../repositories/intefaces/people-repository.interface';
import { IGroupsService } from '../interfaces/groups-service.interface';
import { Group } from '../../models/group.model';
import { IGroupsRepository } from '../../repositories/intefaces/groups-repository.interface';

@Injectable({
  providedIn: 'root'
})
export class GroupsService extends BaseService<Group> implements IGroupsService {
  constructor(
    @Inject(GROUPS_REPOSITORY_TOKEN) repository: IGroupsRepository
  ) {
    super(repository);
  }

  // Implementa métodos específicos si los hay
}
