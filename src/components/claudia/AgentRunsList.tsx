import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Clock, Hash, Bot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { formatISOTimestamp } from "@/lib/date-utils";
import type { AgentRunWithMetrics } from "@/lib/claudia-api";
import { AGENT_ICONS } from "./CCAgents";
import { AgentRunOutputViewer } from "./AgentRunOutputViewer";

interface AgentRunsListProps {
  /**
   * Array of agent runs to display
   */
  runs: AgentRunWithMetrics[];
  /**
   * Callback when a run is clicked
   */
  onRunClick?: (run: AgentRunWithMetrics) => void;
  /**
   * Optional className for styling
   */
  className?: string;
}

const ITEMS_PER_PAGE = 5;

/**
 * AgentRunsList component - Displays a paginated list of agent execution runs
 * 
 * @example
 * <AgentRunsList
 *   runs={runs}
 *   onRunClick={(run) => console.log('Selected:', run)}
 * />
 */
export const AgentRunsList: React.FC<AgentRunsListProps> = ({
  runs,
  onRunClick,
  className,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRun, setSelectedRun] = useState<AgentRunWithMetrics | null>(null);
  
  // Calculate pagination
  const totalPages = Math.ceil(runs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRuns = runs.slice(startIndex, endIndex);
  
  // Reset to page 1 if runs change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [runs.length]);
  
  const renderIcon = (iconName: string) => {
    const Icon = AGENT_ICONS[iconName as keyof typeof AGENT_ICONS] || Bot;
    return <Icon className="h-4 w-4" />;
  };
  
  const formatDuration = (ms?: number) => {
    if (!ms) return "N/A";
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  const formatTokens = (tokens?: number) => {
    if (!tokens) return "0";
    if (tokens >= 1000) {
      return `${(tokens / 1000).toFixed(1)}k`;
    }
    return tokens.toString();
  };
  
  const handleRunClick = (run: AgentRunWithMetrics) => {
    // If there's a callback, use it (for full-page navigation)
    if (onRunClick) {
      onRunClick(run);
    } else {
      // Otherwise, open in modal preview
      setSelectedRun(run);
    }
  };
  
  if (runs.length === 0) {
    return (
      <div className={cn("text-center py-12 text-muted-foreground", className)}>
        <div className="relative">
          <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-muted-foreground/20"></div>
        </div>
        <h3 className="text-lg font-medium mb-2">No Execution History</h3>
        <p className="text-sm">Agent execution history will appear here after running agents</p>
      </div>
    );
  }

  return (
    <>
      <div className={cn("space-y-2", className)}>
        <AnimatePresence mode="popLayout">
          {currentRuns.map((run, index) => (
            <motion.div
              key={run.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <Card
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99]",
                  run.status === "running" && "border-l-4 border-l-green-500 bg-green-50/30",
                  run.status === "completed" && "border-l-4 border-l-blue-500",
                  run.status === "failed" && "border-l-4 border-l-red-500"
                )}
                onClick={() => handleRunClick(run)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 relative">
                      <div className={cn(
                        "p-2 rounded-full",
                        run.status === "running" && "bg-green-100",
                        run.status === "completed" && "bg-blue-100", 
                        run.status === "failed" && "bg-red-100",
                        !run.status && "bg-gray-100"
                      )}>
                        {renderIcon(run.agent_icon)}
                      </div>
                      {run.status === "running" && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-white"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium truncate">
                          {run.agent_name}
                        </h4>
                        {run.status === "running" && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-0.5 rounded-full">
                              ● LIVE
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground truncate mb-1">
                        {run.task}
                      </p>
                      
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatISOTimestamp(run.created_at)}</span>
                        </div>
                        
                        {run.metrics?.duration_ms && (
                          <span>{formatDuration(run.metrics.duration_ms)}</span>
                        )}
                        
                        {run.metrics?.total_tokens && (
                          <div className="flex items-center gap-1">
                            <Hash className="h-3 w-3" />
                            <span>{formatTokens(run.metrics.total_tokens)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <Badge 
                        variant={
                          run.status === "completed" ? "default" :
                          run.status === "running" ? "secondary" :
                          run.status === "failed" ? "destructive" :
                          "outline"
                        }
                        className="text-xs"
                      >
                        {run.status === "completed" ? "Completed" :
                         run.status === "running" ? "Running" :
                         run.status === "failed" ? "Failed" :
                         "Pending"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pt-2">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Agent Run Output Viewer Modal */}
      {selectedRun && (
        <AgentRunOutputViewer
          run={selectedRun}
          onClose={() => setSelectedRun(null)}
        />
      )}
    </>
  );
}; 