// src/app/core/person.model.ts
import { Model } from "./base.model";

export interface Person extends Model{
    name:string,
    surname:string,
    age?:number,
    email?:string, //TODO: Quitar interrogación más adelante
    gender:string,
    picture?:{
        large:string,
        thumbnail:string
    },
    groupID?:string
}