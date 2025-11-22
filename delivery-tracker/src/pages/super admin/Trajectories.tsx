import TrajectorySession from '@/components/base/TrajectorySession'
import TrajectoryMap from '@/components/base/TrajectoryMap'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import useFetch from '@/hooks/useFetchData'
import React, { useState, useEffect } from 'react'
import type { Session } from '@/types/types'

function Trajectories() {
  const { data, loading } = useFetch('/trajectory/trajectories', {
    immediate: true
  });

  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  useEffect(() => {
    if (data?.sessions?.length > 0 && !selectedSession) {
      setSelectedSession(data.sessions[0]);
    }
  }, [data, selectedSession]);

  console.log('Fetched trajectories data:', data);
  
  return (
    <div className='flex gap-4 flex-col md:flex-row w-full'>
      <Card className='!min-w-1/3'>
        <CardContent className='px-0'>
          <CardHeader className='font-extrabold text-primary text-3xl '>
            Trajectories history
          </CardHeader>
          <CardContent className='mt-4 h-[75vh] overflow-y-scroll flex flex-col gap-4 pt-4'>
            {!loading && data?.sessions?.map((session: Session, idx: number) => (
              <div
                key={idx}
                onClick={() => setSelectedSession(session)}
                className={`cursor-pointer transition-all ${
                  selectedSession?.sessionId === session.sessionId
                    ? 'ring-2 ring-primary'
                    : ''
                }`}
              >
                <TrajectorySession trajectory={session} />
              </div>
            ))}
          </CardContent>
          <CardFooter>
            {data?.count && `Total: ${data.count} sessions`}
          </CardFooter>
        </CardContent>
      </Card>
      
      <Card className='flex-1'>
        <CardContent className='p-0 h-[85vh]'>
          <TrajectoryMap trajectoryArray={selectedSession} />
        </CardContent>
      </Card>
    </div>
  );
}

export default Trajectories;