export type Locale = 'en' | 'km' | 'zh';

export const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Language names
    english: 'English',
    khmer: 'ខ្មែរ (Khmer)',
    chinese: '中文 (Chinese)',

    // Sidebar
    dashboard: 'Dashboard',
    farm_layout: 'Farm Layout',
    plant_catalog: 'Plant Catalog',
    discussion: 'Discussion',

    // Header User Menu
    settings: 'Settings',
    logout: 'Log out',
    welcome_back_user: 'Welcome back!',

    // Dashboard Page
    dashboard_greeting: "Hello, {username}! Here's an overview of your farm.",
  },
  km: {
    english: 'English',
    khmer: 'ខ្មែរ (Khmer)',
    chinese: '中文 (Chinese)',

    dashboard: 'ផ្ទាំងគ្រប់គ្រង',
    farm_layout: 'ប្លង់កសិដ្ឋាន',
    plant_catalog: 'កាតាឡុកพืช',
    discussion: 'ការពិភាក្សា',
    
    settings: 'ការកំណត់',
    logout: 'ចាកចេញ',
    welcome_back_user: 'សូមស្វាគមន៍!',

    dashboard_greeting: "សួស្តី {username}! នេះគឺជាទិដ្ឋភាពទូទៅនៃកសិដ្ឋានរបស់អ្នក។",
  },
  zh: {
    english: 'English',
    khmer: 'ខ្មែរ (Khmer)',
    chinese: '中文 (Chinese)',
    
    dashboard: '仪表板',
    farm_layout: '农场布局',
    plant_catalog: '植物目录',
    discussion: '讨论区',
    
    settings: '设置',
    logout: '登出',
    welcome_back_user: '欢迎回来！',

    dashboard_greeting: "你好, {username}! 这是您的农场概览。",
  },
};
