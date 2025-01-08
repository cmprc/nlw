import dayjs from "dayjs";
import { and, count, desc, eq, gte, lte, sql } from "drizzle-orm";
import { number } from "zod";
import { db } from "../db/index";
import { goalCompletions, goals } from "../db/schema";

export async function getWeekPendingGoals(){
    const lastDayOfWeek = dayjs().endOf('week').toDate()
    const firstDayOfWeek = dayjs().startOf('week').toDate()

    const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
        db.select().from(goals).where(lte(goals.createdAt, lastDayOfWeek)).orderBy(desc(goals.createdAt))
    )

    const goalsCompletedOnWeek = db.$with('goals_completed_on_week').as(
        db.select({
            goalId: goalCompletions.goalId,
            completedCount: count(goalCompletions.goalId).as('completed_count'),
        }).from(goalCompletions).where(and(
            lte(goalCompletions.createdAt, lastDayOfWeek),
            gte(goalCompletions.createdAt, firstDayOfWeek)
        )).groupBy(goalCompletions.goalId)
    )

    const pendingGoals = await db.with(goalsCreatedUpToWeek, goalsCompletedOnWeek).select({
        id: goalsCreatedUpToWeek.id,
        title: goalsCreatedUpToWeek.title,
        desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
        completedTimes: sql`COALESCE(${goalsCompletedOnWeek.completedCount}, 0)`.mapWith(Number)
    }).from(goalsCreatedUpToWeek)
        .leftJoin(goalsCompletedOnWeek, eq(goalsCreatedUpToWeek.id, goalsCompletedOnWeek.goalId))

    return {
        pendingGoals
    }
}