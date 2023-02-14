import { User } from "@prisma/client"

export class Workout {
    id?: number
    date?: Date | string
    WorkoutDetails?: {}
    User?: User
}