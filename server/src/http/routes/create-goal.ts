import { FastifyPluginAsync } from "fastify";
import z from "zod";
import { createGoals } from "../../features/create-goals";

export const createGoalRoute: FastifyPluginAsync = async (fastify, options) => {
    fastify.post('/create-goal', async (request) => {
        const createGoalsSchema = z.object({
           title: z.string(),
           desiredWeeklyFrequency: z.number().min(1).max(7),
        })
     
        const { title, desiredWeeklyFrequency } = createGoalsSchema.parse(request.body)
     
        await createGoals({
           title,
           desiredWeeklyFrequency
        })
     })
}