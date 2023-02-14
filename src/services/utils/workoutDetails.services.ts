import { WorkoutDetails } from "../../models/workoutDetails";

// At build
export class WorkoutDetailsService {
    private workoutDetails: WorkoutDetails;

    constructor() {
        this.workoutDetails = new WorkoutDetails();
    }

    static getWorkoutDetails = async (): Promise<WorkoutDetails> => {
        return null;
    }
}