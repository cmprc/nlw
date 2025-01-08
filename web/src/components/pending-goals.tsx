import { Plus } from "lucide-react";
import { OutlineButton } from "./ui/outline-button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPendingGoals } from "../http/get-pending-goals";
import { createGoalCompletion } from "../http/create-goal-completion";

export function PendingGoals(){
    const queryClient = useQueryClient()

    const { data } = useQuery({
        queryKey: ['goals'],
        queryFn: getPendingGoals,
        staleTime: 1000 * 60,
    })

    if(!data) return null

    async function handleCompletion(goalId: string) {
        await createGoalCompletion(goalId)
        
        queryClient.invalidateQueries({ queryKey: ['summary'] })
        queryClient.invalidateQueries({ queryKey: ['goals'] })
    }

    return (
        <div className="flex flex-wrap gap-1">
            {data.map(goal => (
                <OutlineButton onClick={() => handleCompletion(goal.id)} key={goal.id} className="text-xs" disabled={goal.completedTimes >= goal.desiredWeeklyFrequency}>
                    <Plus className="size-4 text-zinc-400" />
                    {goal.title}
                </OutlineButton>
            ))}
        </div>
    )
}