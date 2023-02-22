import { Prisma, PrismaClient } from "@prisma/client";
import { last30daysDto } from "../../dto/last30days.dto";

const prisma = new PrismaClient();

export class Last30daysService {
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

        return lastTrophy;
    }

    static mergeObject = (workoutUser: any, idLastTrophies: any) => {
        const dataFastestKilometer = "5mn45/km"; // at change => calculate automatically after

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
            (acc: any, obj: any) => (acc = deepMergeSum(acc, obj))
        );

        const resume: last30daysDto = Object.assign(
            { workoutNumber: workoutUser.length },
            {
                totalKilometer:
                    result.totalKilometer.toString().replace(".", ",") + "km",
            },
            { totalTime: result.totalTime.toString().replace(".", "h") + "mn" },
            { fastestKilometer: dataFastestKilometer },
            { lastTrophy: idLastTrophies?.id }
        );

        return resume;
    }

    static findLastTrophy30days = (idLast30days: number) => {
        return prisma.last30days.findUnique({
            select: {
                trophiesId: true
            },
            where: {
                id: idLast30days,
            },
        })
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

    static findData = async (userId: number) => {
        const last30Days = await prisma.last30days.findFirst({
            select: {
                workoutNumber: true,
                totalKilometer: true,
                totalTime: true,
                fastestKilometer: true,
                Trophies: true
            },
            where: {
                userId: userId
            }
        });
        return last30Days;
    }

    static add = async (responseData: any) => {
        return prisma.last30days.create({
            data: responseData
        });
    }

    static update = async (responseData: any, idLast30days: number) => {
        return prisma.last30days.update({
            where: {
                id: idLast30days
            },
            data: {
                workoutNumber: responseData.workoutNumber,
                totalKilometer: responseData.totalKilometer,
                totalTime: responseData.totalTime,
                fastestKilometer: responseData.fastestKilometer,
                Trophies: {
                    connect: {
                        id: responseData.Trophies.connect.id,
                    },
                },
            }
        });
    }
}