export async function createGoalCompletion(goalId: string){
    const response = await fetch(`http://localhost:3000/create-goal-completion`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goalId }),
    })

    return response
}