import React, { useState } from 'react';
import { motion, PanInfo, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Edit3, ChevronRight, Clock } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileTaskItemProps {
  task: {
    id: string;
    title: string;
    completed: boolean;
    description?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    category?: string;
    estimatedDuration?: number;
    logField?: string;
    logValue?: string;
    isEditable?: boolean;
  };
  onSwipeComplete?: () => void;
  onSwipeDelete?: () => void;
  onSwipeEdit?: () => void;
  onUpdate?: (field: string, value: string) => void;
  color?: 'orange' | 'yellow' | 'green' | 'red' | 'pink' | 'blue' | 'purple' | 'indigo';
  variant?: 'default' | 'compact' | 'editable' | 'workout';
  showPriority?: boolean;
  showDuration?: boolean;
  showLog?: boolean;
  placeholder?: string;
  className?: string;
}

interface MobileSwipeCardProps {
  children?: React.ReactNode;
  task?: {
    id: string;
    title: string;
    completed: boolean;
    description?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    category?: string;
    estimatedDuration?: number;
    logField?: string;
    logValue?: string;
    isEditable?: boolean;
  };
  onSwipeComplete?: () => void;
  onSwipeDelete?: () => void;
  onSwipeEdit?: () => void;
  onUpdate?: (field: string, value: string) => void;
  color?: 'orange' | 'yellow' | 'green' | 'red' | 'pink' | 'blue' | 'purple' | 'indigo';
  variant?: 'default' | 'compact' | 'editable' | 'workout';
  showPriority?: boolean;
  showDuration?: boolean;
  showLog?: boolean;
  placeholder?: string;
  className?: string;
  swipeThreshold?: number;
}

const getColorClasses = (color: string) => {
  const colors = {
    orange: {
      border: 'border-transparent hover:border-white',
      bg: 'bg-orange-500/10',
      text: 'text-orange-300',
      checkbox: 'border-orange-500 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500'
    },
    yellow: {
      border: 'border-transparent hover:border-white',
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-300',
      checkbox: 'border-yellow-500 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500'
    },
    green: {
      border: 'border-transparent hover:border-white',
      bg: 'bg-green-500/10',
      text: 'text-green-300',
      checkbox: 'border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500'
    },
    red: {
      border: 'border-transparent hover:border-white',
      bg: 'bg-red-500/10',
      text: 'text-red-300',
      checkbox: 'border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500'
    },
    pink: {
      border: 'border-transparent hover:border-white',
      bg: 'bg-pink-500/10',
      text: 'text-pink-300',
      checkbox: 'border-pink-500 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500'
    },
    blue: {
      border: 'border-transparent hover:border-white',
      bg: 'bg-blue-500/10',
      text: 'text-blue-300',
      checkbox: 'border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500'
    },
    purple: {
      border: 'border-transparent hover:border-white',
      bg: 'bg-purple-500/10',
      text: 'text-purple-300',
      checkbox: 'border-purple-500 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500'
    },
    indigo: {
      border: 'border-transparent hover:border-white',
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-300',
      checkbox: 'border-indigo-500 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500'
    }
  };
  
  return colors[color as keyof typeof colors] || colors.orange;
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'border-red-500/50 text-red-400 bg-red-500/10';
    case 'high':
      return 'border-orange-500/50 text-orange-400 bg-orange-500/10';
    case 'medium':
      return 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10';
    case 'low':
      return 'border-green-500/50 text-green-400 bg-green-500/10';
    default:
      return 'border-gray-500/50 text-gray-400 bg-gray-500/10';
  }
};

export const MobileSwipeCard: React.FC<MobileSwipeCardProps> = ({
  children,
  task,
  onSwipeComplete,
  onSwipeDelete,
  onSwipeEdit,
  onUpdate,
  color = 'orange',
  variant = 'default',
  showPriority = false,
  showDuration = false,
  showLog = false,
  placeholder,
  className,
  swipeThreshold = 100
}) => {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > swipeThreshold || velocity > 500) {
      // Swipe right - complete task
      onSwipeComplete?.();
      setSwipeDirection(null);
      x.set(0);
    } else if (offset < -swipeThreshold || velocity < -500) {
      // Swipe left - edit task
      onSwipeEdit?.();
      setSwipeDirection(null);
      x.set(0);
    } else {
      // Return to center
      setSwipeDirection(null);
      x.set(0);
    }
  };

  const handleDrag = (event: any, info: PanInfo) => {
    const offset = info.offset.x;
    if (offset > 50) {
      setSwipeDirection('right');
    } else if (offset < -50) {
      setSwipeDirection('left');
    } else {
      setSwipeDirection(null);
    }
  };

  // If task is provided, render as a task item
  if (task) {
    return (
      <MobileTaskItem
        task={task}
        onSwipeComplete={onSwipeComplete}
        onSwipeDelete={onSwipeDelete}
        onSwipeEdit={onSwipeEdit}
        onUpdate={onUpdate}
        color={color}
        variant={variant}
        showPriority={showPriority}
        showDuration={showDuration}
        showLog={showLog}
        placeholder={placeholder}
        className={className}
      />
    );
  }

  // Otherwise render as a wrapper for children
  return (
    <div className="relative overflow-hidden">
      <motion.div
        drag="x"
        dragConstraints={{ left: -200, right: 200 }}
        dragElastic={0.1}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        className={cn(
          'relative bg-gradient-to-r from-gray-800/60 to-gray-900/40 backdrop-blur-sm rounded-lg border border-gray-700/50 touch-pan-y',
          className
        )}
        style={{ x, opacity }}
      >
        {children}
      </motion.div>

      {/* Swipe Actions Background */}
      <AnimatePresence>
        {swipeDirection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              'absolute inset-0 flex items-center justify-center rounded-lg',
              swipeDirection === 'right' 
                ? 'bg-green-500/20 border-green-500/50' 
                : 'bg-red-500/20 border-red-500/50'
            )}
          >
            <div className="flex items-center space-x-2 text-white font-medium">
              {swipeDirection === 'right' ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  <span>Complete</span>
                </>
              ) : (
                <>
                  <Edit3 className="h-5 w-5 text-red-400" />
                  <span>Edit</span>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const MobileTaskItem: React.FC<MobileTaskItemProps> = ({
  task,
  onSwipeComplete,
  onSwipeDelete,
  onSwipeEdit,
  onUpdate,
  color = 'orange',
  variant = 'default',
  showPriority = false,
  showDuration = false,
  showLog = false,
  placeholder,
  className
}) => {
  const renderTaskContent = () => {
    if (variant === 'editable') {
      return (
        <div className="p-3 flex items-center space-x-3">
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="flex-shrink-0"
          >
            <Checkbox
              checked={task.completed}
              onCheckedChange={onSwipeComplete}
              className={cn(
                'border-2 h-5 w-5 rounded-md transition-colors',
                getColorClasses(color).checkbox
              )}
            />
          </motion.div>
          
          <div className="flex-1">
            <Input
              value={task.title}
              onChange={(e) => onUpdate?.('title', e.target.value)}
              className="bg-transparent border-none text-white p-0 focus:ring-0 text-sm h-6"
              placeholder={placeholder || "Enter task..."}
            />
          </div>
        </div>
      );
    }

    if (variant === 'workout') {
      return (
        <div className="p-3 space-y-2">
          <div className="flex items-center space-x-3">
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="flex-shrink-0"
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={onSwipeComplete}
                className={cn(
                  'border-2 h-5 w-5 rounded-md transition-colors',
                  getColorClasses(color).checkbox
                )}
              />
            </motion.div>
            
            <div className="flex-1">
              <h3 className={cn(
                'font-medium text-sm',
                task.completed ? 'line-through text-gray-500' : 'text-white'
              )}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-gray-400 text-xs mt-1">
                  {task.description}
                </p>
              )}
            </div>
          </div>
          
          {showLog && (
            <div className="ml-8">
              <div className="flex items-center space-x-2">
                <Input
                  value={task.logValue || ''}
                  onChange={(e) => onUpdate?.('logValue', e.target.value)}
                  className="bg-gray-800 border border-gray-600 text-white text-xs h-8 flex-1 focus:ring-0 focus:outline-none focus:border-gray-600 rounded px-2"
                  placeholder={task.logField || "Log result..."}
                />
                {!task.completed && (
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const currentValue = parseInt(task.logValue || '0');
                        const newValue = Math.max(0, currentValue - 5);
                        onUpdate?.('logValue', newValue.toString());
                      }}
                      className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 text-xs h-8 px-1 min-w-[24px]"
                    >
                      -5
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const currentValue = parseInt(task.logValue || '0');
                        const newValue = currentValue + 5;
                        onUpdate?.('logValue', newValue.toString());
                      }}
                      className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 text-xs h-8 px-1 min-w-[24px]"
                    >
                      +5
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const currentValue = parseInt(task.logValue || '0');
                        const newValue = currentValue + 10;
                        onUpdate?.('logValue', newValue.toString());
                      }}
                      className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 text-xs h-8 px-1 min-w-[24px]"
                    >
                      +10
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (variant === 'compact') {
      return (
        <div className="p-2 flex items-center space-x-2">
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="flex-shrink-0"
          >
            <Checkbox
              checked={task.completed}
              onCheckedChange={onSwipeComplete}
              className={cn(
                'border-2 h-4 w-4 rounded-md transition-colors',
                getColorClasses(color).checkbox
              )}
            />
          </motion.div>
          
          <div className="flex-1">
            <h3 className={cn(
              'font-medium text-xs',
              task.completed ? 'line-through text-gray-500' : 'text-white'
            )}>
              {task.title}
            </h3>
          </div>
        </div>
      );
    }

    // Default variant
    return (
      <div className="p-3 flex items-center space-x-3">
        <motion.div
          whileTap={{ scale: 0.9 }}
          className="flex-shrink-0"
        >
          <Checkbox
            checked={task.completed}
            onCheckedChange={onSwipeComplete}
            className={cn(
              'border-2 h-5 w-5 rounded-md transition-colors',
              getColorClasses(color).checkbox
            )}
          />
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={cn(
              'font-medium text-sm truncate',
              task.completed ? 'line-through text-gray-500' : 'text-white'
            )}>
              {task.title}
            </h3>
            
            {showPriority && task.priority && (
              <Badge 
                variant="outline" 
                className={cn(
                  'text-xs px-2 py-0.5 ml-2',
                  getPriorityColor(task.priority)
                )}
              >
                {task.priority}
              </Badge>
            )}
          </div>
          
          {task.description && (
            <p className="text-gray-400 text-xs mt-1 truncate">
              {task.description}
            </p>
          )}
          
          {showDuration && task.estimatedDuration && (
            <div className="flex items-center space-x-1 mt-1">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-400">
                {task.estimatedDuration}h
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 text-gray-400">
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="p-1 rounded-full hover:bg-gray-700 transition-colors"
            onClick={onSwipeEdit}
          >
            <Edit3 className="h-4 w-4" />
          </motion.div>
          
          <div className="flex items-center space-x-1">
            <ChevronRight className="h-3 w-3" />
            <ChevronRight className="h-3 w-3 -ml-1" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <MobileSwipeCard
      onSwipeComplete={onSwipeComplete}
      onSwipeDelete={onSwipeDelete}
      onSwipeEdit={onSwipeEdit}
      color={color}
      className={className}
    >
      <div className={cn(
        'bg-gradient-to-r from-gray-800/60 to-gray-900/40 backdrop-blur-sm rounded-lg border transition-colors',
        getColorClasses(color).border,
        task.completed && 'border-green-500/50 bg-green-500/10'
      )}>
        {renderTaskContent()}
      </div>
    </MobileSwipeCard>
  );
};

export default MobileSwipeCard;