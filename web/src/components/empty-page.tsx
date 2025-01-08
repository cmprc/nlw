import logo from '../assets/logo.svg'
import illustration from '../assets/illustration.svg'
import { DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'

export function EmptyPage() {
    return (
        <div className="h-screen flex flex-col items-center justify-center gap-8">
        <img src={logo} alt="In.Orbit" />
        <img src={illustration} alt="In.Orbit" />
        <p className='text-zinc-400 max-w-80 text-center leading-snug text-sm'>
          Você ainda não cadastrou nenhuma meta, que tal cadastrar um agora mesmo?
        </p>

        <DialogTrigger asChild>
          <Button>
            <Plus className='size-4' />
            Cadastrar
          </Button>
        </DialogTrigger>
      </div>
    )
}