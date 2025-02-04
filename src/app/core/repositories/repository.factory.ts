// src/app/repositories/repository.factory.ts
import { FactoryProvider, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseRepositoryHttpService } from './impl/base-repository-http.service';
import { IBaseRepository } from './intefaces/base-repository.interface';
import { Person } from '../models/person.model';
import { AUTH_MAPPING_TOKEN, AUTH_ME_API_URL_TOKEN, AUTH_SIGN_IN_API_URL_TOKEN, AUTH_SIGN_UP_API_URL_TOKEN, BACKEND_TOKEN, GROUPS_API_URL_TOKEN, GROUPS_REPOSITORY_MAPPING_TOKEN, GROUPS_REPOSITORY_TOKEN, GROUPS_RESOURCE_NAME_TOKEN, PEOPLE_API_URL_TOKEN, PEOPLE_REPOSITORY_MAPPING_TOKEN, PEOPLE_REPOSITORY_TOKEN, PEOPLE_RESOURCE_NAME_TOKEN, UPLOAD_API_URL_TOKEN, FIREBASE_CONFIG_TOKEN, COLLECTION_SUBSCRIPTION_TOKEN, PEOPLE_COLLECTION_SUBSCRIPTION_TOKEN, GROUPS_COLLECTION_SUBSCRIPTION_TOKEN } from './repository.tokens';
import { BaseRespositoryLocalStorageService } from './impl/base-repository-local-storage.service';
import { Model } from '../models/base.model';
import { IBaseMapping } from './intefaces/base-mapping.interface';
import { JsonServerRepositoryService } from './impl/json-server-repository.service';
import { Group } from '../models/group.model';
import { StrapiRepositoryService } from './impl/strapi-repository.service';
import { BaseAuthenticationService } from '../services/impl/base-authentication.service';
import { IAuthMapping } from '../services/interfaces/auth-mapping.interface';
import { StrapiAuthenticationService } from '../services/impl/strapi-authentication.service';
import { PeopleLocalStorageMapping } from './impl/people-mapping-local-storage.service';
import { PeopleMappingJsonServer } from './impl/people-mapping-json-server.service';
import { PeopleMappingStrapi } from './impl/people-mapping-strapi.service';
import { StrapiAuthMappingService } from '../services/impl/strapi-auth-mapping.service';
import { GroupsMappingJsonServer } from './impl/groups-mapping-json-server.service';
import { GroupsMappingStrapi } from './impl/groups-mapping-strapi.service';
import { IStrapiAuthentication } from '../services/interfaces/strapi-authentication.interface';
import { StrapiMediaService } from '../services/impl/strapi-media.service';
import { BaseMediaService } from '../services/impl/base-media.service';
import { BaseRepositoryFirebaseService } from './impl/base-repository-firebase.service';
import { PeopleMappingFirebaseService } from './impl/people-mapping-firebase.service';
import { FirebaseAuthenticationService } from '../services/impl/firebase-authentication.service';
import { FirebaseAuthMappingService } from '../services/impl/firebase-auth-mapping.service';
import { GroupsMappingFirebaseService } from './impl/groups-mapping-firebase.service';
import { FirebaseMediaService } from '../services/impl/firebase-media.service';
import { IAuthentication } from '../services/interfaces/authentication.interface';
import { FirebaseCollectionSubscriptionService } from '../services/impl/firebase-collection-subscription.service';
import { ICollectionSubscription } from '../services/interfaces/collection-subscription.interface';

export function createBaseRepositoryFactory<T extends Model>(
  token: InjectionToken<IBaseRepository<T>>,
  dependencies:any[]): FactoryProvider {
  return {
    provide: token,
    useFactory: (backend: string, http: HttpClient, auth:IStrapiAuthentication, apiURL: string, resource: string, mapping: IBaseMapping<T>, firebaseConfig?: any) => {
      switch (backend) {
        case 'http':
          return new BaseRepositoryHttpService<T>(http, auth, apiURL, resource, mapping);
        case 'local-storage':
          return new BaseRespositoryLocalStorageService<T>(resource, mapping);
        case 'json-server':
          return new JsonServerRepositoryService<T>(http, auth,apiURL, resource, mapping);
        case 'strapi':
          return new StrapiRepositoryService<T>(http, auth, apiURL, resource, mapping);
        case 'firebase':
          return new BaseRepositoryFirebaseService<T>(firebaseConfig, resource, mapping);
        default:
          throw new Error("BACKEND NOT IMPLEMENTED");
      }
    },
    deps: dependencies
  };
};

export function createBaseMappingFactory<T extends Model>(
  token: InjectionToken<IBaseMapping<T>>,
  dependencies: any[],
  modelType: 'person' | 'group'
): FactoryProvider {
  return {
    provide: token,
    useFactory: (backend: string, firebaseConfig?: any) => {
      switch (backend) {
        case 'local-storage':
          return modelType === 'person' 
            ? new PeopleLocalStorageMapping()
            : null;
        case 'json-server':
          return modelType === 'person'
            ? new PeopleMappingJsonServer()
            : new GroupsMappingJsonServer();
        case 'strapi':
          return modelType === 'person'
            ? new PeopleMappingStrapi()
            : new GroupsMappingStrapi();
        case 'firebase':
          return modelType === 'person'
            ? new PeopleMappingFirebaseService(firebaseConfig)
            : new GroupsMappingFirebaseService(firebaseConfig);
        default:
          throw new Error("BACKEND NOT IMPLEMENTED");
      }
    },
    deps: dependencies
  };
};

export function createBaseAuthMappingFactory(token: InjectionToken<IAuthMapping>, dependencies:any[]): FactoryProvider {
  return {
    provide: token,
    useFactory: (backend: string) => {
      switch (backend) {
        case 'http':
          throw new Error("BACKEND NOT IMPLEMENTED");
        case 'local-storage':
          throw new Error("BACKEND NOT IMPLEMENTED");
        case 'json-server':
          throw new Error("BACKEND NOT IMPLEMENTED");
        
        case 'strapi':
          return new StrapiAuthMappingService();
        case 'firebase':
          return new FirebaseAuthMappingService();
        default:
          throw new Error("BACKEND NOT IMPLEMENTED");
      }
    },
    deps: dependencies
  };
};


export const PeopleMappingFactory = createBaseMappingFactory<Person>(
  PEOPLE_REPOSITORY_MAPPING_TOKEN, 
  [BACKEND_TOKEN, FIREBASE_CONFIG_TOKEN],
  'person'
);

export const GroupsMappingFactory = createBaseMappingFactory<Group>(
  GROUPS_REPOSITORY_MAPPING_TOKEN, 
  [BACKEND_TOKEN, FIREBASE_CONFIG_TOKEN],
  'group'
);

export const AuthMappingFactory: FactoryProvider = createBaseAuthMappingFactory(AUTH_MAPPING_TOKEN, [BACKEND_TOKEN]);

export const AuthenticationServiceFactory:FactoryProvider = {
  provide: BaseAuthenticationService,
  useFactory: (backend:string, firebaseConfig:any, signIn:string, signUp:string, meUrl:string, mapping:IAuthMapping, http:HttpClient) => {
    switch(backend){
      case 'http':
        throw new Error("BACKEND NOT IMPLEMENTED");
      case 'local-storage':
        throw new Error("BACKEND NOT IMPLEMENTED");
      case 'json-server':
        throw new Error("BACKEND NOT IMPLEMENTED");
      case 'strapi':
        return new StrapiAuthenticationService(signIn, signUp, meUrl, mapping, http);
      case 'firebase':
        return new FirebaseAuthenticationService(firebaseConfig, mapping);
      default:
        throw new Error("BACKEND NOT IMPLEMENTED");
    }
    
  },
  deps: [BACKEND_TOKEN, FIREBASE_CONFIG_TOKEN, AUTH_SIGN_IN_API_URL_TOKEN, AUTH_SIGN_UP_API_URL_TOKEN, AUTH_ME_API_URL_TOKEN, AUTH_MAPPING_TOKEN, HttpClient]
};

export const MediaServiceFactory:FactoryProvider = {
  provide: BaseMediaService,
  useFactory: (backend:string, firebaseConfig:any, upload:string, auth:IAuthentication, http:HttpClient) => {
    switch(backend){
      case 'http':
        throw new Error("BACKEND NOT IMPLEMENTED");
      case 'local-storage':
        throw new Error("BACKEND NOT IMPLEMENTED");
      case 'json-server':
        throw new Error("BACKEND NOT IMPLEMENTED");
      case 'firebase':
        return new FirebaseMediaService(firebaseConfig, auth);
      case 'strapi':
        return new StrapiMediaService(upload, auth as IStrapiAuthentication, http);
      default:
        throw new Error("BACKEND NOT IMPLEMENTED");
    }
    
  },
  deps: [BACKEND_TOKEN, FIREBASE_CONFIG_TOKEN, UPLOAD_API_URL_TOKEN, BaseAuthenticationService, HttpClient]
};

export const PeopleRepositoryFactory: FactoryProvider = createBaseRepositoryFactory<Person>(PEOPLE_REPOSITORY_TOKEN,
  [
    BACKEND_TOKEN, 
    HttpClient, 
    BaseAuthenticationService, 
    PEOPLE_API_URL_TOKEN, 
    PEOPLE_RESOURCE_NAME_TOKEN, 
    PEOPLE_REPOSITORY_MAPPING_TOKEN,
    FIREBASE_CONFIG_TOKEN
  ]
);
export const GroupsRepositoryFactory: FactoryProvider = createBaseRepositoryFactory<Group>(GROUPS_REPOSITORY_TOKEN,
  [
    BACKEND_TOKEN, 
    HttpClient, 
    BaseAuthenticationService, 
    GROUPS_API_URL_TOKEN, 
    GROUPS_RESOURCE_NAME_TOKEN, 
    GROUPS_REPOSITORY_MAPPING_TOKEN,
    FIREBASE_CONFIG_TOKEN
  ]
);

export function createCollectionSubscriptionFactory<T extends Model>(
  collectionName: string,
  mappingToken: InjectionToken<IBaseMapping<T>>,
  collectionSubscriptionToken: InjectionToken<ICollectionSubscription<T>>
): FactoryProvider {
  return {
    provide: collectionSubscriptionToken,
    useFactory: (backend: string, firebaseConfig: any, mapping: IBaseMapping<T>) => {
      switch (backend) {
        case 'firebase':
          return new FirebaseCollectionSubscriptionService<T>(firebaseConfig, mapping);
        default:
          throw new Error("BACKEND NOT IMPLEMENTED");
      }
    },
    deps: [BACKEND_TOKEN, FIREBASE_CONFIG_TOKEN, mappingToken]
  };
}

// Factorías específicas para cada tipo
export const PeopleCollectionSubscriptionFactory = createCollectionSubscriptionFactory<Person>(
  'people',
  PEOPLE_REPOSITORY_MAPPING_TOKEN,
  PEOPLE_COLLECTION_SUBSCRIPTION_TOKEN
);

export const GroupsCollectionSubscriptionFactory = createCollectionSubscriptionFactory<Group>(
  'groups',
  GROUPS_REPOSITORY_MAPPING_TOKEN,
  GROUPS_COLLECTION_SUBSCRIPTION_TOKEN
);
