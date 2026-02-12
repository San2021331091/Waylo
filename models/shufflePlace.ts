import {Places} from "@/models/places";

export interface ShufflePlace{
    shuffleDaily : (places : Places,maxItems?: number) => Places;
}