import { client, db } from './index'
import { goalCompletions, goals } from './schema'

async function seed() {
    await db.delete(goalCompletions)
    await db.delete(goals)

    const result = await db.insert(goals).values([
        { title: "Wash hands", desiredWeeklyFrequency: 3 },
        { title: "Exercise", desiredWeeklyFrequency: 3 },
        { title: "Meditate", desiredWeeklyFrequency: 1 },
    ]).returning()

    await db.insert(goalCompletions).values([
        { goalId: result[0].id, createdAt: new Date() },
    ])  
}

seed().finally(() => {
    client.end()
})