import { FastifyPluginAsync } from "fastify";
import { getWeekPendingGoals } from "../../features/get-week-pending-goals";

export const getPendingGoalsRoute: FastifyPluginAsync = async (fastify, options) => {
    fastify.get('/goals', async () => {
        return await getWeekPendingGoals()
     })
}