import {ShufflePlace} from "@/models/shufflePlace";
import {Places} from "@/models/places";

export class ShufflePlaceDaily implements ShufflePlace{
    shuffleDaily(places: Places,maxItems = 12): Places {
        const today = new Date();
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

        const pseudoRandom = (value: number): number => {
            const x = Math.sin(seed + value) * 10000;
            return x - Math.floor(x);
        };

        // Attach random value for each place based on index
        const randomized = places.map((place, index) => ({
            ...place,
            dailyRandom: pseudoRandom(index),
        }));

        // Sort descending by dailyRandom
        randomized.sort((a, b) => b.dailyRandom - a.dailyRandom);

        return randomized.slice(0, maxItems);
    }

}
