type SummaryResponse = {
    completed: number;
    total: number;
    goalsPerDay: Record<string, {
        id: string;
        title: string;
        completedAt: string;
    }[]>
}

export async function getSummary(): Promise<SummaryResponse>{
    const response = await fetch('http://localhost:3000/summary')
    const data = response.json()
    return data
}