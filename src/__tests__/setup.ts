import '@testing-library/jest-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Mock i18n for tests
i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          'toast.demoProviderError': 'useDemoContext must be used within a DemoProvider',
          'toast.demoMode': 'Demo Mode',
          'toast.demoTaskCreated': 'Task created in demo mode',
          'toast.demoTaskUpdated': 'Task updated in demo mode',
          'toast.demoTaskDeleted': 'Task deleted in demo mode',
          'toast.demoTaskStatusUpdated': 'Task status updated in demo mode',
          'navbar.dashboard': 'Dashboard',
          'navbar.tasks': 'My Tasks',
          'navbar.createTask': 'Create Task',
          'navbar.logout': 'Logout',
          'navbar.menu': 'Menu',
          'login.backToHome': 'Back to Home',
          'login.welcomeBack': 'Welcome back',
          'login.signInDescription': 'Sign in to your account to continue',
          'login.email': 'Email',
          'login.emailPlaceholder': 'Enter your email',
          'login.password': 'Password',
          'login.passwordPlaceholder': 'Enter your password',
          'login.forgotPassword': 'Forgot Password?',
          'login.signIn': 'Sign In',
          'login.noAccount': 'Don\'t have an account?',
          'login.signUp': 'Sign up',
          'taskCard.highPriority': 'high priority',
          'taskCard.mediumPriority': 'medium priority',
          'taskCard.lowPriority': 'low priority',
          'taskCard.due': 'Due {{date}}',
          'taskCard.created': 'Created {{date}}',
          'dashboard.metaDescription': 'Task management dashboard',
          'dashboard.title': 'Dashboard',
          'dashboard.welcome': 'Welcome back, {{username}}!',
          'dashboard.subtitle': 'Here\'s what\'s happening with your tasks today.',
          'dashboard.stats.total': 'Total Tasks',
          'dashboard.stats.fromYesterday': '+2 from yesterday',
          'dashboard.stats.completed': 'Completed',
          'dashboard.stats.greatProgress': 'Great progress!',
          'dashboard.stats.inProgress': 'In Progress',
          'dashboard.stats.keepItUp': 'Keep it up!',
          'dashboard.stats.overdue': 'Overdue',
          'dashboard.stats.allCaughtUp': 'All caught up!',
          'dashboard.quickActions': 'Quick Actions',
          'dashboard.newTask': 'New Task',
          'dashboard.viewAllTasks': 'View All Tasks',
          'dashboard.recentTasks': 'Recent Tasks',
          'dashboard.viewAll': 'View all',
          'dashboard.noTasks': 'No tasks yet.',
          'dashboard.createFirstTask': 'Create your first task',
          'language.switchLanguage': 'Switch Language',
          'language.en': 'English',
          'language.de': 'German',
          'language.ar': 'Arabic'
        }
      }
    }
  });

export default i18n;