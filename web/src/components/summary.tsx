import { CheckCircle2, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { DialogTrigger } from "./ui/dialog";
import { Progress, ProgressIndicator } from "./ui/progress-bar";
import { Separator } from "./ui/separator";
import { getSummary } from "../http/get-summary";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs"
import ptBR from 'dayjs/locale/pt-br'
import { PendingGoals } from "./pending-goals";

export function Summary() {
    const { data } = useQuery({
        queryKey: ['summary'],
        queryFn: getSummary,
        staleTime: 1000 * 60, // 1 minute
    })

    if (!data) return null

    dayjs.locale(ptBR)
    const firstDayOfWeek = dayjs().startOf('week')
    const lastDayOfWeek = dayjs().endOf('week')

    const completedPercentage = Math.round(data.completed / data.total * 100)

    return (
        <div className="h-full max-w-[480px] mx-auto flex flex-col gap-4 py-10 px-5">
            <div className="flex items-center justify-between">
                <span className="text-zinc-200 font-bold leading-none capitalize">
                    {firstDayOfWeek.format('DD MMMM')} - {lastDayOfWeek.format('DD MMMM')}
                </span>
                <DialogTrigger asChild>
                    <Button size="sm">
                        <Plus className='size-4' />
                        Cadastrar
                    </Button>
                </DialogTrigger>
            </div>

            <div className="flex flex-col gap-3">
                <Progress max={data.total}>
                    <ProgressIndicator style={{ width: `${completedPercentage}%` }} />
                </Progress>
                <div className="flex gap-2 items-start justify-between">
                    <span className="text-zinc-400 text-sm leading-tight">Você completou <span className="text-zinc-200">{data.completed}</span> de <span className="text-zinc-200">{data.total}</span> metas nessa semana.</span>
                    <span className="text-zinc-400 text-sm leading-tight">{completedPercentage}%</span>
                </div>
            </div>

            <Separator />
            <PendingGoals />

            <div className="flex flex-col gap-6">
                <h2 className="text-xl font-medium">Sua semana</h2>
                {data.goalsPerDay ? (
                    Object.entries(data.goalsPerDay).map(([date, goals]) => (
                        <div key={date} className="flex flex-col gap-4">
                            <h3 className="font-medium">
                                <span className="capitalize">{dayjs(date).format('dddd')}</span>
                                <span className="text-zinc-400 text-xs ml-1">({dayjs(date).format('DD [de] MMMM')})</span>
                            </h3>

                            <ul className="flex flex-col gap-2">
                                {goals.map((goal) => {
                                    return (
                                        <li key={goal.id} className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 text-pink-500" />
                                            <span className="text-zinc-400 text-sm">
                                                Você completou "
                                                <span className="text-zinc-200">{goal.title}</span>" às {' '}
                                                <span className="text-zinc-200">{dayjs(goal.completedAt).format('HH:mm')}</span>
                                            </span>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                ))) : (
                    <span className="text-zinc-400 text-sm">Nenhuma meta encontrada</span>
                )}
            </div>
        </div>
    )
}