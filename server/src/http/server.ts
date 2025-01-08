import fastifyCors from "@fastify/cors"
import fastify from "fastify"
import { createGoalRoute } from "./routes/create-goal"
import { createGoalCompletionRoute } from "./routes/create-goal-completion"
import { getPendingGoalsRoute } from "./routes/get-pending-goals"
import { getWeekSummaryRoute } from "./routes/get-week-summary"

const app = fastify()

app.register(fastifyCors, {
   origin: '*'
})

app.register(getPendingGoalsRoute)
app.register(getWeekSummaryRoute)
app.register(createGoalRoute)
app.register(createGoalCompletionRoute)

app.listen({ 
    port: 3000   
 }).then(() => {
    console.log("HTTP Server running on http://localhost:3000");
 });