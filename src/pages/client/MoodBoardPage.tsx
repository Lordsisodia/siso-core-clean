import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MoodBoardGenerator } from '@/components/client/mood-board/MoodBoardGenerator';

export default function MoodBoardPage() {
  const navigate = useNavigate();

  const handleComplete = (preferences: any) => {
    // Save preferences and navigate to next step
    console.log('Mood board completed:', preferences);
    navigate('/client-dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <h1 className="text-lg font-semibold">Design Preferences</h1>
            
            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <MoodBoardGenerator onComplete={handleComplete} />
      </main>
    </div>
  );
}