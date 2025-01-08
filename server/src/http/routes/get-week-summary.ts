import { FastifyPluginAsync } from "fastify";
import { getWeekSummary } from "../../features/get-week-summary";

export const getWeekSummaryRoute: FastifyPluginAsync = async (fastify, options) => {
    fastify.get('/summary', async () => {
        return await getWeekSummary()
     })
}