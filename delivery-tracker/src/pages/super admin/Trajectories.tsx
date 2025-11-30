import TrajectorySession from '@/components/base/TrajectorySession'
import TrajectoryMap from '@/components/base/TrajectoryMap'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import useFetch from '@/hooks/useFetchData'
import React, { useState, useEffect } from 'react'
import type { Session } from '@/types/types'

function Trajectories() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const limit = 6;

  const { data, loading, refetch } = useFetch(`/trajectory/data/${currentPage}/${limit}`, {
    immediate: true
  });

  console.log("data", data);

  useEffect(() => {
    if (data?.sessions?.length > 0 && !selectedSession) {
      setSelectedSession(data.sessions[0]);
    }
  }, [data, selectedSession]);

  // Refetch when page changes
  useEffect(() => {
    refetch();
  }, [currentPage]);

  const totalPages = data?.totalPages || 0;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('ellipsis');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSelectedSession(null); // Reset selection on page change
    }
  };

  console.log('Fetched trajectories data:', data);
  
  return (
    <div className='flex gap-4 flex-col w-full'>
      <Card className='!min-w-1/3'>
        <CardContent className='px-0'>
          <CardHeader className='font-extrabold text-primary text-3xl'>
            Trajectories history
          </CardHeader>
          <CardContent className='mt-4 h-[60vh] overflow-y-auto flex flex-wrap gap-4 pt-4'>
            {loading && (
              <div className="w-full text-center py-8 text-gray-500">
                Loading trajectories...
              </div>
            )}
            {!loading && data?.sessions?.length === 0 && (
              <div className="w-full text-center py-8 text-gray-500">
                No trajectories found
              </div>
            )}
            {!loading && data?.sessions?.map((session: Session, idx: number) => (
              <div
                key={idx}
                onClick={() => setSelectedSession(session)}
                className={`cursor-pointer transition-all w-[23rem] ${
                  selectedSession?.sessionId === session.sessionId
                    ? 'ring-2 ring-primary'
                    : ''
                }`}
              >
                <TrajectorySession trajectory={session} />
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-4">
            {data?.count !== undefined && (
              <div className="text-sm text-gray-600 w-full">
                Total: {data.count} sessions | Page {currentPage} of {totalPages}
              </div>
            )}
            
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={
                        currentPage === 1 
                          ? 'pointer-events-none opacity-50' 
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                  
                  {getPageNumbers().map((page, idx) => (
                    <PaginationItem key={idx}>
                      {page === 'ellipsis' ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          onClick={() => handlePageChange(page as number)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={
                        currentPage === totalPages 
                          ? 'pointer-events-none opacity-50' 
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
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