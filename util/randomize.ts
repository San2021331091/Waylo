import {RandomizablePlace} from "@/models/randomizedplaces";
import {Places} from "@/models/places";

export class RandomizedPlace implements RandomizablePlace{

    randomize(places: Places): Places {
        const randomTitles = ["Amazing Escape", "Luxury Retreat", "Hidden Gem", "Dream Destination", "Vacation Paradise"];

        return places.map((item) => ({
            ...item,
            price_usd: Math.floor(Math.random() * 500) + 50, // random price between 50–550
            title: randomTitles[Math.floor(Math.random() * randomTitles.length)],
        }));
    }



}