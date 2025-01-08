import dayjs from "dayjs";
import { and, count, desc, eq, getTableColumns, gte, lte, sql } from "drizzle-orm";
import { db } from "../db/index"
import { goalCompletions, goals } from "../db/schema"

interface createGoalsCompletionSchema {
    goalId: string
}

export async function createGoalsCompletion({ goalId }: createGoalsCompletionSchema) {
    const lastDayOfWeek = dayjs().endOf('week').toDate()
    const firstDayOfWeek = dayjs().startOf('week').toDate()

    const goalsCompletedOnWeek = db.$with('goals_completed_on_week').as(
        db.select({
            goalId: goalCompletions.goalId,
            completedCount: count(goalCompletions.goalId).as('completed_count'),
        }).from(goalCompletions).where(and(
            lte(goalCompletions.createdAt, lastDayOfWeek),
            gte(goalCompletions.createdAt, firstDayOfWeek)
        )).groupBy(goalCompletions.goalId)
    )

    const result = await db.with(goalsCompletedOnWeek).select({
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        completedTimes: sql`COALESCE(${goalsCompletedOnWeek.completedCount}, 0)`.mapWith(Number)
    }).from(goals).leftJoin(goalsCompletedOnWeek, eq(goalsCompletedOnWeek.goalId, goals.id)).where(eq(goals.id, goalId))

    const { desiredWeeklyFrequency, completedTimes } = result[0]

    if(completedTimes >= desiredWeeklyFrequency){
        throw new Error("Goal has already reached completion limit for the week");
    }

    const response = await db.insert(goalCompletions).values({
        goalId
    }).returning()

    const goalCompletion = response[0]

    return {
        goalCompletion
    }
}