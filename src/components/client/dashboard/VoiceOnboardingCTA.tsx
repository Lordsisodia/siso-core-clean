/**
 * Voice Onboarding CTA Component
 * Prominent call-to-action for voice-based quick setup
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useClientDetails } from '@/hooks/client/useClientDetails';
import { Mic, Clock, Sparkles } from 'lucide-react';

export function VoiceOnboardingCTA() {
  const navigate = useNavigate();
  const { clientData } = useClientDetails();

  // Don't show if voice onboarding is already completed
  if (clientData?.voice_onboarding_complete) {
    return null;
  }

  // Don't show if project is already well underway
  const currentStep = clientData?.current_step || 0;
  if (currentStep > 10) {
    return null;
  }

  const handleStartVoiceChat = () => {
    navigate('/client-dashboard/quick-setup?mode=voice');
  };

  return (
    <Card className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 border-purple-500/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20"></div>
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <Badge variant="outline" className="border-white/30 text-white bg-white/10">
                Quick Setup
              </Badge>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>🎙️ 2-Minute Voice Setup</span>
              </h3>
              <p className="text-purple-100 text-sm max-w-md">
                Skip the forms! Tell us about your business in a quick voice chat. 
                Our AI will capture everything and set up your project automatically.
              </p>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-purple-100">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>2-3 minutes</span>
              </div>
              <div className="flex items-center space-x-1">
                <Sparkles className="w-4 h-4" />
                <span>AI-powered</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <Button 
              size="lg"
              className="bg-white text-purple-600 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 font-semibold px-8 py-3 shadow-lg"
              onClick={handleStartVoiceChat}
            >
              <Mic className="mr-2 h-4 w-4" />
              Start Voice Chat
            </Button>
          </div>
        </div>
        
        {/* Mobile button */}
        <div className="md:hidden mt-4">
          <Button 
            size="lg"
            className="w-full bg-white text-purple-600 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 font-semibold shadow-lg"
            onClick={handleStartVoiceChat}
          >
            <Mic className="mr-2 h-4 w-4" />
            Start Voice Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}