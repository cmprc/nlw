import { Dialog } from './components/ui/dialog'
import { CreateGoal } from './components/create-goal'
import { Summary } from './components/summary'
import { useQuery } from '@tanstack/react-query'
import { getSummary } from './http/get-summary'
import { EmptyPage } from './components/empty-page'

export function App() {
  const { data } = useQuery({
    queryKey: ['summary'],
    queryFn: getSummary,
    staleTime: 1000 * 60, // 1 minute
  })

  if(!data) return null

  return (
    <Dialog>
      {data.total === 0 ? (<EmptyPage/>) : (<Summary/>) }
      <CreateGoal />
    </Dialog>
  )
}
