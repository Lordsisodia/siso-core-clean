import { 
  LayoutDashboard, ListTodo, MessageSquare, Wallet, 
  Trophy, FileText, HelpCircle, 
  ClipboardList, CalendarClock, User, FlaskConical,
  Zap, Palette, Map, Unlock, Lock, Rocket, Activity,
  CreditCard, Users, TestTube, Bot
} from 'lucide-react';
import { MenuSection } from './types';

// Get user progress from localStorage
const getUserProgress = () => {
  try {
    const authToken = localStorage.getItem('sb-xkrxhkxqbyrrmjsmcbrx-auth-token');
    if (!authToken) return null;
    
    const { user } = JSON.parse(authToken);
    if (!user) return null;
    
    const progress = localStorage.getItem(`dashboard_progress_${user.id}`);
    return progress ? JSON.parse(progress) : {
      hasCompletedOnboarding: false,
      hasCompletedMoodBoard: false,
      hasAcceptedAppPlan: false,
      hasViewedTimeline: false,
      hasSetupPayment: false,
      hasStartedDevelopment: false,
      hasCompletedTesting: false,
      hasLaunched: false,
    };
  } catch {
    return null;
  }
};

export const getMenuSections = (): MenuSection[] => {
  const progress = getUserProgress();
  
  return [
    {
      type: 'main',
      href: '/home',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      type: 'section',
      title: 'Project Flow',
      icon: Zap,
      items: [
        {
          href: '/client/onboarding',
          icon: MessageSquare,
          label: 'Onboarding',
          badge: progress?.hasCompletedOnboarding ? 'Complete' : 'Start',
          badgeColor: progress?.hasCompletedOnboarding ? 'orange' : 'red',
        },
        {
          href: '/client/mood-board',
          icon: Palette,
          label: 'Mood Board',
          badge: progress?.hasCompletedMoodBoard ? 'Complete' : 
                 progress?.hasCompletedOnboarding ? 'Available' : 'Locked',
          badgeColor: progress?.hasCompletedMoodBoard ? 'orange' : 
                      progress?.hasCompletedOnboarding ? 'red' : 'gray',
          disabled: !progress?.hasCompletedOnboarding,
        },
        {
          href: '/client/app-plan',
          icon: FileText,
          label: 'App Plan',
          badge: progress?.hasAcceptedAppPlan ? 'Accepted' : 
                 progress?.hasCompletedMoodBoard ? 'Review' : 'Locked',
          badgeColor: progress?.hasAcceptedAppPlan ? 'orange' : 
                      progress?.hasCompletedMoodBoard ? 'red' : 'gray',
          disabled: !progress?.hasCompletedMoodBoard,
        },
        {
          href: '/client/timeline',
          icon: Map,
          label: 'Timeline/PDR',
          badge: progress?.hasAcceptedAppPlan ? 'Active' : 'Locked',
          badgeColor: progress?.hasAcceptedAppPlan ? 'red' : 'gray',
          disabled: !progress?.hasAcceptedAppPlan,
        },
        {
          href: '/client/agent-teams',
          icon: Bot,
          label: 'Agent Teams',
          badge: progress?.hasAcceptedAppPlan ? 'Live' : 'Locked',
          badgeColor: progress?.hasAcceptedAppPlan ? 'orange' : 'gray',
          disabled: !progress?.hasAcceptedAppPlan,
        },
        {
          href: '/client/payments',
          icon: CreditCard,
          label: 'Payments',
          badge: progress?.hasSetupPayment ? 'Active' : 
                 progress?.hasAcceptedAppPlan ? 'Setup' : 'Locked',
          badgeColor: progress?.hasSetupPayment ? 'orange' : 
                      progress?.hasAcceptedAppPlan ? 'red' : 'gray',
          disabled: !progress?.hasAcceptedAppPlan,
        },
        {
          href: '/client/development',
          icon: Zap,
          label: 'Development',
          badge: progress?.hasStartedDevelopment ? 'In Progress' : 'Locked',
          badgeColor: progress?.hasStartedDevelopment ? 'red' : 'gray',
          disabled: !progress?.hasViewedTimeline,
        },
        {
          href: '/client/testing',
          icon: TestTube,
          label: 'Testing',
          badge: progress?.hasCompletedTesting ? 'Complete' : 
                 progress?.hasStartedDevelopment ? 'Active' : 'Locked',
          badgeColor: progress?.hasCompletedTesting ? 'orange' : 
                      progress?.hasStartedDevelopment ? 'red' : 'gray',
          disabled: !progress?.hasStartedDevelopment,
        },
        {
          href: '/client/launch',
          icon: Rocket,
          label: 'Launch',
          badge: progress?.hasLaunched ? 'Live' : 
                 progress?.hasCompletedTesting ? 'Ready' : 'Locked',
          badgeColor: progress?.hasLaunched ? 'orange' : 
                      progress?.hasCompletedTesting ? 'red' : 'gray',
          disabled: !progress?.hasCompletedTesting,
        },
      ]
    },
    {
      type: 'section',
      title: 'Projects & Tasks',
      icon: ListTodo,
      items: [
        {
          href: '/projects/tasks',
          icon: ListTodo,
          label: 'Active Tasks',
        },
        {
          href: '/onboarding-chat',
          icon: MessageSquare,
          label: 'SISO Assistant',
        },
        {
          href: '/projects/timeline',
          icon: CalendarClock,
          label: 'Timeline',
        },
        {
          href: '/projects/plan-features',
          icon: ClipboardList,
          label: 'App Plan',
        },
        {
          href: '/testing',
          icon: FlaskConical,
          label: 'AI Testing'
        }
      ]
    },
    {
      type: 'section',
      title: 'Financial',
      icon: Wallet,
      items: [
        {
          href: '/financial/payments',
          icon: Wallet,
          label: 'Financial',
        },
        {
          href: '/economy/leaderboards',
          icon: Trophy,
          label: 'Leaderboards',
        }
      ]
    },
    {
      type: 'section',
      title: 'Resources',
      icon: HelpCircle,
      items: [
        {
          href: '/resources',
          icon: HelpCircle,
          label: 'Help & Support',
        },
        {
          href: '/resources/documents',
          icon: FileText,
          label: 'Documents',
        }
      ]
    }
  ];
};