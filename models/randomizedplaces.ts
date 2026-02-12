import {Places} from "@/models/places";

export interface RandomizablePlace{
     randomize : (places: Places) => Places;
}

