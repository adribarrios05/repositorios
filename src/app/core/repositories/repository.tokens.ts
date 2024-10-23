// src/app/repositories/repository.tokens.ts
import { InjectionToken } from '@angular/core';
import { IBaseRepository } from './intefaces/base-repository.interface';
import { ITasksRepository } from './intefaces/tasks-repository.interface';
import { IPeopleRepository } from './intefaces/people-repository.interface';
import { IBaseMapping } from './intefaces/base-mapping.interface';
import { Person } from '../models/person.model';

export const RESOURCE_NAME_TOKEN = new InjectionToken<string>('ResourceName');
export const PEOPLE_RESOURCE_NAME_TOKEN = new InjectionToken<string>('PeopleResourceName');
export const GROUPS_RESOURCE_NAME_TOKEN = new InjectionToken<string>('GroupsResourceName');
export const REPOSITORY_TOKEN = new InjectionToken<IBaseRepository<any>>('REPOSITORY_TOKEN');
export const PEOPLE_REPOSITORY_TOKEN = new InjectionToken<IPeopleRepository>('IPeopleRepository');
export const GROUPS_REPOSITORY_TOKEN = new InjectionToken<IPeopleRepository>('IGroupsRepository');
export const TASKS_REPOSITORY_TOKEN = new InjectionToken<ITasksRepository>('ITasksRepository');

export const API_URL_TOKEN = new InjectionToken<string>('ApiUrl');
export const PEOPLE_API_URL_TOKEN = new InjectionToken<string>('PeopleApiUrl');
export const GROUPS_API_URL_TOKEN = new InjectionToken<string>('GroupsApiUrl');
export const TASKS_API_URL_TOKEN = new InjectionToken<string>('TasksApiUrl');

export const REPOSITORY_MAPPING_TOKEN = new InjectionToken<IBaseMapping<any>>('IBaseRepositoryMapping');
export const PEOPLE_REPOSITORY_MAPPING_TOKEN = new InjectionToken<IBaseMapping<Person>>('IPeopleRepositoryMapping');
export const GROUPS_REPOSITORY_MAPPING_TOKEN = new InjectionToken<IBaseMapping<Person>>('IGroupsRepositoryMapping');
