import { X } from "lucide-react";
import { Button } from "./ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupIndicator, RadioGroupItem } from "./ui/radio-group";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createGoal } from "../http/create-goal";
import { useQueryClient } from "@tanstack/react-query";

const createGoalSchema = z.object({
  title: z.string().min(1, 'Informe o nome da atividade'),
  desiredWeeklyFrequency: z.coerce.number().min(1).max(7),
})

type CreateGoalProps = z.infer<typeof createGoalSchema>

export function CreateGoal(){
  const queryClient = useQueryClient()
  
  const { register, control, handleSubmit, formState: { errors }, reset } = useForm<CreateGoalProps>({
    resolver: zodResolver(createGoalSchema),
  })

  async function handleCreateGoal(data: CreateGoalProps){
    await createGoal({
      title: data.title,
      desiredWeeklyFrequency: data.desiredWeeklyFrequency
    })

    queryClient.invalidateQueries({ queryKey: ['goals'] })
    queryClient.invalidateQueries({ queryKey: ['summary'] })

    reset()
  }

  async function handleCloseDialog(){
    reset()
  }

    return (
        <DialogContent onCloseAutoFocus={handleCloseDialog}>
        <div className='flex flex-col gap-6 h-full'>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center justify-between'>
              <DialogTitle>Criar meta</DialogTitle>
              <DialogClose asChild>
                <X className='size-4' />
              </DialogClose>
            </div>

            <DialogDescription>
              Adicione atividades que te fazem bem e que você quer continuar praticando toda semana.
            </DialogDescription>
          </div>

          <form onSubmit={handleSubmit(handleCreateGoal)} className='flex flex-col flex-1 justify-between gap-4'>
            <div className='flex flex-col gap-2'>
              <div className='flex flex-col gap-2'>
                <Label htmlFor='title'>Qual a atividade?</Label>
                <Input autoFocus id='title' placeholder='ex.: Estudar React' {...register('title')} />
                {errors.title && <span className='text-red-400 text-xs'>{errors.title.message}</span>}
              </div>
              <div className='flex flex-col gap-2'>
                <Label htmlFor='time'>Durante quanto tempo?</Label>
                <Controller control={control} name="desiredWeeklyFrequency" defaultValue={2} render={({ field }) => {
                  return (
                    <RadioGroup onValueChange={field.onChange} value={String(field.value)}>
                      <RadioGroupItem value='1'>
                        <RadioGroupIndicator />
                        <span className='text-zinc-400 text-sm font-medium leading-none ml-2'>1 vez na semana</span> 
                      </RadioGroupItem>
                      <RadioGroupItem value='2'>
                        <RadioGroupIndicator />
                        <span className='text-zinc-400 text-sm font-medium leading-none ml-2'>2 vezes na semana</span> 
                      </RadioGroupItem>
                      <RadioGroupItem value='3'>
                        <RadioGroupIndicator />
                        <span className='text-zinc-400 text-sm font-medium leading-none ml-2'>3 vezes na semana</span> 
                      </RadioGroupItem>
                      <RadioGroupItem value='4'>
                        <RadioGroupIndicator />
                        <span className='text-zinc-400 text-sm font-medium leading-none ml-2'>4 vezes na semana</span> 
                      </RadioGroupItem>
                      <RadioGroupItem value='5'>
                        <RadioGroupIndicator />
                        <span className='text-zinc-400 text-sm font-medium leading-none ml-2'>5 vezes na semana</span> 
                      </RadioGroupItem>
                      <RadioGroupItem value='6'>
                        <RadioGroupIndicator />
                        <span className='text-zinc-400 text-sm font-medium leading-none ml-2'>6 vezes na semana</span> 
                      </RadioGroupItem>
                      <RadioGroupItem value='7'>
                        <RadioGroupIndicator />
                        <span className='text-zinc-400 text-sm font-medium leading-none ml-2'>7 vezes na semana</span> 
                      </RadioGroupItem>
                    </RadioGroup>
                  )
                }} />
              </div>
            </div>
            <div className='flex justify-between gap-2'>
              <DialogClose asChild>
                <Button type='button' variant='secondary' className='flex-1'>Cancelar</Button> 
              </DialogClose>
              <Button type='submit' className='flex-1'>Salvar</Button>
            </div>
          </form>
        </div>
      </DialogContent>
    )
}