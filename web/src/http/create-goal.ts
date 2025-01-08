interface createGoalProps {
    title: string,
    desiredWeeklyFrequency: number
}

export async function createGoal({ title, desiredWeeklyFrequency }: createGoalProps) {
    const response = await fetch(`http://localhost:3000/create-goal`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, desiredWeeklyFrequency }),
    })

    return response
}