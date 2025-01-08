import { db } from "../db/index"
import { goals } from "../db/schema"

interface createGoalsProps {
    title: string
    desiredWeeklyFrequency: number
}

export async function createGoals({ title, desiredWeeklyFrequency }: createGoalsProps) {
    console.log("Creating goals")

    const result = await db.insert(goals).values({
        title,
        desiredWeeklyFrequency
    }).returning()

    const goal = result[0];

    return {
        goal,
    }
}