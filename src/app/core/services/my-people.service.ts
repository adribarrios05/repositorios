import { HttpBackend, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { Paginated } from "../models/paginated.model";
import { PersonRaw } from "../repositories/impl/people-mapping-json-server.service";
import { Person } from "../models/person.model";

export interface PaginatedRaw<T>{
    first: number
    prev: number | null
    next: number | null
    last: number
    pages: number
    items: number
    data: T[]
  }
  
@Injectable({
    providedIn:'root'
})



export class MyPeopleService{

    private apiUrl:string = "http://localhost:3000/personas"
    constructor(
        private http:HttpClient
    ){

    }

    getAll(page:number, pageSize:number): Observable<Paginated<Person>> {
        return this.http.get<PaginatedRaw<PersonRaw>>
        (`${this.apiUrl}/?_page=${page}&_per_page=${pageSize}`)
        .pipe(map(res => {
            return {page:page, pageSize:pageSize, pages:res.pages, data:res.data.map<Person>((d:PersonRaw)=>{
                return {
                    id:d.id, 
                    name:d.nombre, 
                    surname:d.apellidos, 
                    age:(d as any)["age"]??0,
                    picture:(d as any)["picture"]?{
                        large:(d as any)["picture"].large, 
                        thumbnail:(d as any)["picture"].thumbnail
                    }:undefined};
            })}; 
        }))
      }

}