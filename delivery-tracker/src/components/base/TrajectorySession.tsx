//@ts-nocheck
import React from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import type { TrajectoryCardProps } from '@/types/types'
import { Car, Clock, Dot, Flag, Mail, Phone, Truck, User } from 'lucide-react'
import { differenceInMinutes } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import useReverseGeocode from '@/hooks/useLocations'

function TrajectorySession({ trajectory }: TrajectoryCardProps) {
    const points = trajectory.points || []
    const { place, loading } = useReverseGeocode(trajectory.points[0].latitude, trajectory.points[0].longitude);
    const { place : place2, loading : loading2 } = useReverseGeocode(trajectory.points[points.length - 1].latitude, trajectory.points[points.length - 1].longitude);

  let durationText = 'No data'
  if (points.length >= 2) {
    const start = new Date(points[0].timestamp)
    const end = new Date(points[points.length - 1].timestamp)
    const totalMinutes = differenceInMinutes(end, start)

    const days = Math.floor(totalMinutes / (60 * 24))
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
    const minutes = totalMinutes % 60

    durationText =
      (days > 0 ? `${days}d ` : '') +
      (hours > 0 ? `${hours}h ` : '') +
      `${minutes}m`
  }

  return (
    <Card className='!gap-4'>
      <CardHeader className="flex justify-between items-center">
        <span className="text-[10px] text-muted-foreground">
          #{trajectory.sessionId.slice(27)}
        </span>

        <span className="text-[10px] font-medium flex gap-2 items-center text-[var(--blue)] bg-[var(--blue)]/20 px-2 py-1 rounded-[4px]"><Clock size={15} />{durationText}</span>
      </CardHeader>

      <CardContent className=''>

        <div className="flex justify-between">
            <div className="flex gap-4 mb-3 items-center">
            <Avatar className=" ">
                <AvatarImage src={trajectory.vehicle?.driverId?.photo} className='object-cover' />
                <AvatarFallback>{trajectory.vehicle?.driverId?.name[0]+""+trajectory.vehicle?.driverId?.name[1]}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col h-full justify-between ">
                <span className="font-bold flex items-center gap-1"><span><User size={10} /></span>{trajectory.vehicle?.driverId?.name}</span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1"><span><Truck size={10} /></span>
                {trajectory.vehicle.licensePlate}
                </span>
            </div>
            </div>

            <span className='flex gap-4 items-center'>
                <Phone size={15} />
                <Mail size={15} />
            </span>

        </div>

        <div className="flex gap-4 items-center">
          <Flag className="text-[var(--blue)] text-primary" size={15} />
          <span className="h-[3px] flex-1 bg-[var(--blue)] bg-primary"></span>
          <Truck className="text-[var(--blue)] text-primary" size={15} />
        </div>
        <div className="flex justify-between mt-3 text-muted-foreground text-[8px]">
            <span className='max-w-40 overflow-ellipsis'>{loading ? "..." : place}</span>
            <span className='max-w-40 overflow-ellipsis text-right'>{loading2 ? "..." : place2}</span>
        </div>

        

        
      </CardContent>
    </Card>
  )
}

export default TrajectorySession
