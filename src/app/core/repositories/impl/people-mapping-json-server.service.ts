import { Injectable } from "@angular/core";
import { IBaseMapping } from "../intefaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { Person } from "../../models/person.model";

export interface PersonRaw {
    id: string
    nombre: string
    apellidos: string
    email: string
    genero: string
    grupoId: string
}
@Injectable({
    providedIn: 'root'
  })
  export class PeopleMappingJsonServer implements IBaseMapping<Person> {
    getPaginated(page:number, pageSize: number, pages:number, data:PersonRaw[]): Paginated<Person> {
        return {page:page, pageSize:pageSize, pages:pages, data:data.map<Person>((d:PersonRaw)=>{
            return this.getOne(d);
        })};
    }
    getOne(data: PersonRaw):Person {
        return {
            id:data.id, 
            name:data.nombre, 
            surname:data.apellidos, 
            age:(data as any)["age"]??0,
            picture:(data as any)["picture"]?{
                large:(data as any)["picture"].large, 
                thumbnail:(data as any)["picture"].thumbnail
            }:undefined};
    }
    getAdded(data: any):Person {
        throw new Error("Method not implemented.");
    }
    getUpdated(data: any):Person {
        throw new Error("Method not implemented.");
    }
    getDeleted(data: any):Person {
        throw new Error("Method not implemented.");
    }
  }
  