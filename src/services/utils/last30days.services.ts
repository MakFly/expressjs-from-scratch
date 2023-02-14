import { Prisma, PrismaClient } from "@prisma/client";
import { last30daysDto } from "../../dto/last30daysDto";

const prisma = new PrismaClient();

export class last30daysService {
    static findFirstLastTrophie = async () => {
        const lastTrophy = await prisma.trophies.findFirst({
            orderBy: [
                {
                    id: "desc",
                },
            ],
            select: {
                id: true,
            },
        });

        console.log("lastrophie" + JSON.stringify(lastTrophy));
        return lastTrophy;
    }

    static mergeObject = (workoutUser, idLastTrophies?) => {
        const dataTest = "5mn45/km";

        const newDataLast30days = workoutUser.map((res: any) => {
            const {
                id,
                workoutId,
                date,
                checkpoint,
                workouts,
                distance,
                time,
                ...result
            } = res;
            Object.assign(
                result,
                { totalKilometer: distance },
                { totalTime: parseFloat(res.time) }
            );
            return result;
        });

        const deepMergeSum = (obj1: any, obj2: any) => {
            return Object.keys(obj1).reduce((acc: any, key) => {
                if (obj2.hasOwnProperty(key) && !isNaN(obj2[key])) {
                    acc[key] = obj1[key] + obj2[key];
                }
                return acc;
            }, {});
        };

        const result = newDataLast30days.reduce(
            (acc, obj) => (acc = deepMergeSum(acc, obj))
        );

        const resume: last30daysDto = Object.assign(
            { workoutNumber: workoutUser.length },
            {
                totalKilometer:
                    result.totalKilometer.toString().replace(".", ",") + "km",
            },
            { totalTime: result.totalTime.toString().replace(".", "h") + "mn" },
            { fastestKilometer: dataTest },
            { lastTrophy: idLastTrophies?.id }
        );

        return resume;
    }

    static createInputLast30days = (resume: any, userId: number) => {
        let last30Days: Prisma.Last30daysCreateInput;
        last30Days = {
            workoutNumber: resume.workoutNumber,
            totalKilometer: resume.totalKilometer,
            totalTime: resume.totalTime,
            fastestKilometer: resume.fastestKilometer,
            Trophies: {
                connect: {
                    id: resume.lastTrophy,
                },
            },
            User: {
                connect: {
                    id: userId,
                },
            },
        };

        return last30Days;
    }

    static findData = async (userId) => {
        console.log(userId);
        const last30Days = await prisma.last30days.findFirstOrThrow({
            where: {
                User: {
                    id: userId,
                },
            },
        });
        return last30Days;
    }

    static add = async (responseData: any) => {
        return prisma.last30days.create({
            data: responseData
        });
    }

    static update = async (responseData: any, responseId: number) => {
        return prisma.last30days.update({
            where: {
                id: responseId
            },
            data: {
                workoutNumber: responseData.workoutNumber,
                totalKilometer: responseData.totalKilometer,
                totalTime: responseData.totalTime,
                fastestKilometer: responseData.fastestKilometer
            }
        });
    }
}