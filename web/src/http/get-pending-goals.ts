type PendingGoalsResponse = {
    id: string;
    title: string;
    desiredWeeklyFrequency: number;
    completedTimes: number;
}[]

export async function getPendingGoals(): Promise<PendingGoalsResponse> {
    const response = await fetch('http://localhost:3000/goals')
    const data = await response.json()
    return data.pendingGoals
}