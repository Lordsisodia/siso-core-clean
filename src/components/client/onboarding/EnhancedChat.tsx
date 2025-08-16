import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Image, Link, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOnboardingContext } from './OnboardingProvider';
import { MessageLoading } from '@/components/ui/message-loading';

interface EnhancedChatProps {
  onComplete: (data: any) => void;
}

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  mediaUrl?: string;
  requiresInput?: boolean;
}

const chatSteps = {
  basic: {
    question: "Let's start with the basics. What's the name of your business?",
    field: 'company',
    suggestions: ['My business is called...', 'We go by...', 'Our company name is...']
  },
  business: {
    question: "Great! What type of business is {company}? What do you do?",
    field: 'businessType',
    suggestions: ['We are a restaurant', 'We provide services', 'We sell products', 'We are a tech company']
  },
  goals: {
    question: "Excellent! What are your main goals for your new website or app?",
    field: 'goals',
    suggestions: ['Increase sales', 'Build brand awareness', 'Streamline operations', 'Engage customers']
  },
  design: {
    question: "What kind of design style appeals to you? Any brands or websites you admire?",
    field: 'designPreferences',
    suggestions: ['Modern and minimal', 'Bold and colorful', 'Professional and corporate', 'Warm and friendly']
  },
  timeline: {
    question: "When would you like to have this project completed?",
    field: 'timeline',
    suggestions: ['ASAP', 'Within 1 month', 'In 2-3 months', 'No rush, quality matters most']
  }
};

export function EnhancedChat({ onComplete }: EnhancedChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentField, setCurrentField] = useState<keyof typeof chatSteps>('basic');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { 
    formData, 
    updateFormData, 
    updateStep, 
    markStepComplete,
    autoSave 
  } = useOnboardingContext();

  useEffect(() => {
    // Initial message
    addAssistantMessage(
      "👋 Hi! I'm your AI assistant. I'll help you share your vision in just a few minutes. " +
      chatSteps[currentField].question
    );
    updateStep(currentField);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addAssistantMessage = (content: string, suggestions?: string[]) => {
    const message: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      timestamp: new Date(),
      suggestions,
      requiresInput: true
    };
    setMessages(prev => [...prev, message]);
  };

  const addUserMessage = (content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userInput = input.trim();
    setInput('');
    addUserMessage(userInput);
    
    // Update form data
    updateFormData({ [chatSteps[currentField].field]: userInput });
    markStepComplete(currentField);
    
    // Auto-save
    await autoSave();
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsTyping(false);
      
      // Move to next step
      const steps = Object.keys(chatSteps) as Array<keyof typeof chatSteps>;
      const currentIndex = steps.indexOf(currentField);
      
      if (currentIndex < steps.length - 1) {
        const nextField = steps[currentIndex + 1];
        setCurrentField(nextField);
        updateStep(nextField);
        
        // Personalize next question with form data
        let question = chatSteps[nextField].question;
        Object.entries(formData).forEach(([key, value]) => {
          question = question.replace(`{${key}}`, value as string);
        });
        
        addAssistantMessage(
          `Perfect! ${question}`,
          chatSteps[nextField].suggestions
        );
      } else {
        // Complete onboarding
        addAssistantMessage(
          "🎉 Fantastic! I have all the information I need. Let me prepare your personalized dashboard...",
          []
        );
        setTimeout(() => {
          onComplete(formData);
        }, 2000);
      }
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-[600px]">
      <Card className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[80%] ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`flex-shrink-0 rounded-full p-2 ${
                    message.role === 'assistant' ? 'bg-primary/20' : 'bg-muted'
                  }`}>
                    {message.role === 'assistant' ? (
                      <Bot className="h-5 w-5 text-primary" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className={`rounded-lg p-4 ${
                      message.role === 'assistant' 
                        ? 'bg-muted' 
                        : 'bg-primary text-primary-foreground'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary/10 transition-colors"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <Sparkles className="h-3 w-3 mr-1" />
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-3"
            >
              <div className="bg-primary/20 rounded-full p-2">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <MessageLoading />
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="border-t p-4">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex space-x-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your answer..."
                className="pr-10"
                disabled={isTyping}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  disabled
                >
                  <Image className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  disabled
                >
                  <Link className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
            <Button type="submit" disabled={!input.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
          
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send • Supports rich media
          </p>
        </div>
      </Card>
    </div>
  );
}