import { Trophies, User } from "@prisma/client";

export class Last30Days {
    id?: number;
    workoutNumber?: number;
    totalKilometer?: string;
    totalTime?: string;
    fastestKilometer?: string;
    Trophies?: Trophies
    User?: User
}

export interface Last30DaysType {
    exist: boolean,
    data: Last30Days[]
}