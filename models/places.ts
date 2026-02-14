export interface Place {
    id: string;
    title: string;
    city?: string;
    country?: string;
    description: string;
    wiki_page?: string;
    image_url?: string;
    latitude?: number;
    longitude?: number;
    temperature?: number;
    weather_icon?: string;
    price_usd?: number;
    duration_days?: number;
    distance_km?: number;
    created_at?: Date;
    updated_at?: Date;
    tags?: Record<string, any>;
}
export type Places = Place[];