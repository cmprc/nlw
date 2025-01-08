import { FastifyPluginAsync } from "fastify";
import z from "zod";
import { createGoalsCompletion } from "../../features/create-goals-completion";

export const createGoalCompletionRoute: FastifyPluginAsync = async (fastify, options) => {
    fastify.post('/create-goal-completion', async (request) => {
        const createGoalCompletionSchema = z.object({
           goalId: z.string()
        })
     
        const { goalId } = createGoalCompletionSchema.parse(request.body)
     
        await createGoalsCompletion({
           goalId
        })
     })
}