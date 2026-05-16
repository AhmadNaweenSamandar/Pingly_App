import React, { useEffect } from "react";
import { motion } from "motion/react";
import { Lightbulb } from "lucide-react";
import { ProjectIdeaCard } from "../../features/project-ideas/components/ProjectIdeaCard";
import { Button } from "./ui/button";
import "react-quill-new/dist/quill.snow.css";
import { projectIdeasApi } from "../../features/project-ideas/api/projectIdeas.api";
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';

export function ProjectIdeasTab({ setShowProjectDialog }) {
  const [activeTab, setActiveTab] = React.useState<"latest" | "forYou">("latest");

    // 1. The Invisible Tripwire setup
  const { ref, inView } = useInView({ rootMargin: '200px' }); // Triggers the fetch 200px BEFORE the user hits the bottom

  // 2. The React Query Magic (Replaces useState/useEffect)
  const {
    data,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['projectIdeas', activeTab], // Caches "latest" and "forYou" separately!
    queryFn: ({ pageParam }) => projectIdeasApi.getFeed(activeTab, pageParam),
    initialPageParam: undefined as string | undefined,

    // This tells React Query how to find the next cursor from our backend response
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor || undefined, 
  });


  // 3. Trigger the next fetch when the user scrolls to the tripwire
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);


  return (
    <motion.div
      key="ideas"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Project Ideas</h2>
        <p className="text-gray-600 mb-4">Discover and share innovative project concepts</p>

        {/* Action Row */}
        <div className="flex items-center justify-between w-full">
          <Button
            onClick={() => setShowProjectDialog(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 text-white shadow-lg transition-all"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Post Project Idea
          </Button>

          {/* Toggle */}
          <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            {[{ id: 'latest', label: 'Latest' }, { id: 'forYou', label: 'For You' }].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'latest' | 'forYou')}
                className={`relative px-4 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                  activeTab === tab.id ? 'text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-md shadow-md"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    style={{ zIndex: 0 }} 
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* The Feed */}
      {status === 'pending' ? (
        <div className="py-10 text-center text-gray-500 animate-pulse">Loading feed...</div>
      ) : status === 'error' ? (
        
        // The error is now contained ONLY to the feed section
        <div className="mt-6 py-10 text-center text-red-500 bg-red-50 border border-red-100 rounded-xl">
          <h3 className="font-bold text-lg mb-2">Oops! Couldn't load ideas.</h3>
          <p>{(error as Error).message}</p>
        </div>

      ) : data?.pages[0].data.length === 0 ? (
        
        // UX WIN: What to show when the database is actually empty!
        <div className="mt-6 py-16 text-center bg-gray-50 border border-gray-100 rounded-xl">
          <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-gray-800 font-medium text-lg">No project ideas yet.</h3>
          <p className="text-gray-500 text-sm mt-1">Be the first to share an innovative concept!</p>
        </div>

      ) : (
        // The actual feed when data exists. We use the "pages" array from useInfiniteQuery to render all loaded pages, 
        // and we also include the invisible tripwire at the bottom for infinite scrolling.
        <motion.div 
          key={activeTab} 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 mt-6"
        >
          {data?.pages.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page.data.map((project, index) => (
                <ProjectIdeaCard key={project.id} project={project} delay={index * 0.1} />
              ))}
            </React.Fragment>
          ))}
          
          <div ref={ref} className="py-6 flex justify-center items-center h-20">
            {isFetchingNextPage ? (
              <span className="text-gray-500 text-sm animate-pulse">Loading more ideas...</span>
            ) : !hasNextPage ? (
              <span className="text-gray-400 text-sm">You've reached the end!</span>
            ) : null}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}