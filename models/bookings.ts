export interface Booking {
    id: string;
    travel_date: string;
    status: string;
    total_price: number;
    place_title: string;
    city: string;
    country: string;
}

export type PlaceBookings = Booking[];
