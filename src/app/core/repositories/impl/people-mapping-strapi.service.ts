import { Injectable } from "@angular/core";
import { IBaseMapping } from "../intefaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { Person } from "../../models/person.model";

export interface GroupRaw{
    data: Data
}

export interface PersonRaw {
    data: Data
    meta: Meta
  }
  
export interface Data {
    id: number
    attributes: PersonAttributes
}
export interface PersonData {
    data: PersonAttributes;
}

export interface PersonAttributes {
    name: string
    surname: string
    gender: string
    birthdate?: string
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
    group:GroupRaw | number | null
}

export interface GroupAttributes {
    name: string
}

export interface Meta {}

@Injectable({
    providedIn: 'root'
  })
  export class PeopleMappingStrapi implements IBaseMapping<Person> {
    toGenderMapping:any = {
        Masculino:'male',
        Femenino:'female',
        Otros:'other'
    };
    
    fromGenderMapping:any = {
        male:'Masculino',
        female:'Femenino',
        other:'Otros'
    };

    setAdd(data: Person):PersonData {
        return {
            data:{
                name:data.name,
                surname:data.surname,
                gender: this.toGenderMapping[data.gender],
                group:Number(data.groupId)??null

            }
        };
    }
    setUpdate(data: Person):PersonData {
        let toReturn:PersonData = {
            data:{
                name:"",
                surname:"",
                gender:"male",
                group:null
            }
        };  
        Object.keys(data).forEach(key=>{
            switch(key){
                case 'name': toReturn.data['name']=data[key];
                break;
                case 'surname': toReturn.data['surname']=data[key];
                break;
                case 'gender': toReturn.data['gender']=data[key]=='Masculino'?'male':data[key]=='Femenino'?'female':'other';
                break;
                case 'groupId': toReturn.data['group']=Number(data[key])??null;
                break;
                default:
            }
        });
        return toReturn;
    }
    getPaginated(page:number, pageSize: number, pages:number, data:Data[]): Paginated<Person> {
        return {page:page, pageSize:pageSize, pages:pages, data:data.map<Person>((d:Data|PersonRaw)=>{
            return this.getOne(d);
        })};
    }
    getOne(data: Data | PersonRaw): Person {
        const isPersonRaw = (data: Data | PersonRaw): data is PersonRaw => 'meta' in data;

        const attributes = isPersonRaw(data) ? data.data.attributes : data.attributes;
        const id = isPersonRaw(data) ? data.data.id : data.id;
        
        return {
            id: id.toString(),
            name: attributes.name,
            surname: attributes.surname,
            groupId: typeof attributes.group === 'object' ? attributes.group?.data?.id.toString() : undefined,
            gender: this.fromGenderMapping[attributes.gender]
        };
    }
    getAdded(data: PersonRaw):Person {
        return this.getOne(data.data);
    }
    getUpdated(data: PersonRaw):Person {
        return this.getOne(data.data);
    }
    getDeleted(data: PersonRaw):Person {
        return this.getOne(data.data);
    }
  }
  