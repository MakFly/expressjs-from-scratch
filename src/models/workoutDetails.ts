import { Workout } from "./workout";

export class WorkoutDetails {
  date?: Date | string;
  distance!: number | null;
  time?: string | null;
  checkpoint?: {} | null;
  workouts?: Workout;
}
