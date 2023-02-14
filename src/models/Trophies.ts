export class Trophies implements TrophiesType {
    id = 0;
    label = "";
    value = "";
    earned = false;
    tier = 0;
    nameTrophies = "";
    userId = 0;
}

export interface TrophiesType {
    id?: number | null;
    label?: string | null;
    value?: string | null;
    earned?: boolean | null;
    tier?: number | null;
    nameTrophies?: string | null; 
    userId?: number | null
}