import dayjs from "dayjs";
import { and, asc, count, desc, eq, gte, lte, sql, sum } from "drizzle-orm";
import { db } from "../db/index";
import { goalCompletions, goals } from "../db/schema";

export async function getWeekSummary(){
    const lastDayOfWeek = dayjs().endOf('week').toDate()
    const firstDayOfWeek = dayjs().startOf('week').toDate()

    const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
        db.select().from(goals).where(lte(goals.createdAt, lastDayOfWeek)).orderBy(desc(goals.createdAt))
    )

    const goalsCompletedOnWeek = db.$with('goals_completed_on_week').as(
        db
            .select({
                id: goalCompletions.id,
                title: goals.title,
                completedAt: goalCompletions.createdAt,
                completedAtDate: sql`DATE(${goalCompletions.createdAt})`.as('completedAtDate') 
            })
            .from(goalCompletions)
            .innerJoin(goals, eq(goals.id, goalCompletions.goalId))
            .where(and(
                lte(goalCompletions.createdAt, lastDayOfWeek),
                gte(goalCompletions.createdAt, firstDayOfWeek)
            ))
            .orderBy(desc(goalCompletions.createdAt))
    )

    const goalsCompletedByWeekDay = db.$with('goals_completed_by_week_day').as(
        db
            .select({
                completedAtDate: goalsCompletedOnWeek.completedAtDate,
                completions: sql`
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'id', ${goalCompletions.id},
                            'title', ${goals.title},
                            'completedAt', ${goalCompletions.createdAt}
                        )
                    )
                `.as('completions')
            })
            .from(goalsCompletedOnWeek)
            .groupBy(goalsCompletedOnWeek.completedAtDate)
            .orderBy(desc(goalsCompletedOnWeek.completedAtDate))
    )

    type GoalsPerDay = Record<string, {
        id: string
        title: string
        completedAt: string
    }[]>
    
    const summary = await db.with(goalsCreatedUpToWeek, goalsCompletedOnWeek, goalsCompletedByWeekDay)
        .select({
            completed: sql`(SELECT COUNT(id) FROM ${goalsCompletedOnWeek})`.mapWith(Number),
            total: sql`(SELECT SUM(${goalsCreatedUpToWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedUpToWeek})`.mapWith(Number),
            goalsPerDay: sql<GoalsPerDay>`
                JSON_OBJECT_AGG(
                    ${goalsCompletedOnWeek.completedAtDate},
                    ${goalsCompletedByWeekDay.completions}
                )
            `
        })
        .from(goalsCompletedByWeekDay)

    return summary[0]
}