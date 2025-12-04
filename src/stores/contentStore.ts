import { create } from 'zustand';

export type ContentType = 'health-tip' | 'recipe' | 'banner' | 'promo' | 'terms' | 'privacy' | 'nutrition-guide' | 'meal-plan' | 'emergency' | 'announcement';
export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'archived';

export interface DailyStat {
  date: string;
  views: number;
  clicks: number;
}

export interface ContentAnalytics {
  contentId: string;
  views: number;
  clicks: number;
  avgTimeSpent: number;
  viewsTrend: number;
  clicksTrend: number;
  dailyStats: DailyStat[];
}

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  content: string;
  image?: string;
  status: ContentStatus;
  publishDate?: string;
  scheduleDate?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  author: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  linkUrl?: string;
  expiryDate?: string;
}

interface ContentStore {
  contents: ContentItem[];
  analytics: Record<string, ContentAnalytics>;
  addContent: (content: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContent: (id: string, content: Partial<ContentItem>) => void;
  deleteContent: (id: string) => void;
  publishContent: (id: string) => void;
  archiveContent: (id: string) => void;
  duplicateContent: (id: string) => void;
  getAnalytics: (id: string) => ContentAnalytics;
}

const mockContents: ContentItem[] = [
  {
    id: '1',
    type: 'health-tip',
    title: '5 Benefits of Drinking Milk Daily',
    content: 'Milk is a great source of calcium and vitamin D. Here are 5 reasons to include milk in your daily diet...',
    image: '/placeholder.svg',
    status: 'published',
    publishDate: '2024-01-15',
    author: 'Dr. Sarah Khan',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15',
    tags: ['health', 'dairy', 'nutrition'],
  },
  {
    id: '2',
    type: 'recipe',
    title: 'Homemade Paneer Recipe',
    content: 'Learn how to make fresh paneer at home with just 2 ingredients...',
    image: '/placeholder.svg',
    status: 'published',
    publishDate: '2024-01-12',
    author: 'Chef Rahman',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-12',
    tags: ['recipe', 'dairy', 'homemade'],
  },
  {
    id: '3',
    type: 'banner',
    title: 'New Year Sale - 20% Off',
    content: 'Get 20% off on all dairy products this January!',
    image: '/placeholder.svg',
    status: 'published',
    publishDate: '2024-01-01',
    expiryDate: '2024-01-31',
    author: 'Marketing Team',
    createdAt: '2023-12-28',
    updatedAt: '2024-01-01',
    linkUrl: '/products',
  },
  {
    id: '4',
    type: 'promo',
    title: 'Refer a Friend & Earn',
    content: 'Refer your friends and earn 100 coins for each successful referral!',
    image: '/placeholder.svg',
    status: 'scheduled',
    scheduleDate: '2024-02-01',
    author: 'Marketing Team',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
    linkUrl: '/referral',
  },
  {
    id: '5',
    type: 'terms',
    title: 'Terms of Service',
    content: 'These Terms of Service govern your use of our application...',
    status: 'published',
    publishDate: '2024-01-01',
    author: 'Legal Team',
    createdAt: '2023-12-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '6',
    type: 'privacy',
    title: 'Privacy Policy',
    content: 'This Privacy Policy describes how we collect, use, and protect your personal information...',
    status: 'published',
    publishDate: '2024-01-01',
    author: 'Legal Team',
    createdAt: '2023-12-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '7',
    type: 'nutrition-guide',
    title: 'Complete Guide to Dairy Nutrition',
    content: 'Understanding the nutritional benefits of dairy products...',
    image: '/placeholder.svg',
    status: 'published',
    publishDate: '2024-01-10',
    author: 'Nutrition Team',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-10',
    tags: ['nutrition', 'guide', 'dairy'],
  },
  {
    id: '8',
    type: 'meal-plan',
    title: 'Weekly Healthy Meal Plan',
    content: 'A balanced meal plan for the week including dairy products...',
    image: '/placeholder.svg',
    status: 'draft',
    author: 'Nutrition Team',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-18',
    tags: ['meal-plan', 'health', 'weekly'],
  },
  {
    id: '9',
    type: 'emergency',
    title: 'Service Disruption Notice',
    content: 'Due to weather conditions, deliveries in some areas may be delayed...',
    status: 'archived',
    publishDate: '2024-01-05',
    priority: 'high',
    author: 'Operations Team',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-06',
  },
  {
    id: '10',
    type: 'announcement',
    title: 'New Product Launch',
    content: 'Introducing our new organic milk range, now available!',
    image: '/placeholder.svg',
    status: 'published',
    publishDate: '2024-01-20',
    priority: 'medium',
    author: 'Product Team',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-20',
  },
];

// Generate mock analytics for content
const generateMockAnalytics = (contentId: string): ContentAnalytics => {
  const baseViews = Math.floor(Math.random() * 5000) + 500;
  const baseClicks = Math.floor(baseViews * (Math.random() * 0.15 + 0.02));
  
  const dailyStats: DailyStat[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dailyStats.push({
      date: date.toISOString().split('T')[0],
      views: Math.floor(baseViews / 7 * (0.5 + Math.random())),
      clicks: Math.floor(baseClicks / 7 * (0.5 + Math.random())),
    });
  }

  return {
    contentId,
    views: baseViews,
    clicks: baseClicks,
    avgTimeSpent: Math.floor(Math.random() * 180) + 30,
    viewsTrend: Math.floor(Math.random() * 40) - 10,
    clicksTrend: Math.floor(Math.random() * 40) - 10,
    dailyStats,
  };
};

const mockAnalytics: Record<string, ContentAnalytics> = {};
mockContents.forEach(content => {
  mockAnalytics[content.id] = generateMockAnalytics(content.id);
});

export const useContentStore = create<ContentStore>((set, get) => ({
  contents: mockContents,
  analytics: mockAnalytics,
  
  addContent: (content) => set((state) => {
    const newId = Date.now().toString();
    return {
      contents: [
        ...state.contents,
        {
          ...content,
          id: newId,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        },
      ],
      analytics: {
        ...state.analytics,
        [newId]: generateMockAnalytics(newId),
      },
    };
  }),
  
  updateContent: (id, content) => set((state) => ({
    contents: state.contents.map((item) =>
      item.id === id
        ? { ...item, ...content, updatedAt: new Date().toISOString().split('T')[0] }
        : item
    ),
  })),
  
  deleteContent: (id) => set((state) => {
    const { [id]: removed, ...remainingAnalytics } = state.analytics;
    return {
      contents: state.contents.filter((item) => item.id !== id),
      analytics: remainingAnalytics,
    };
  }),
  
  publishContent: (id) => set((state) => ({
    contents: state.contents.map((item) =>
      item.id === id
        ? {
            ...item,
            status: 'published' as ContentStatus,
            publishDate: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
          }
        : item
    ),
  })),
  
  archiveContent: (id) => set((state) => ({
    contents: state.contents.map((item) =>
      item.id === id
        ? {
            ...item,
            status: 'archived' as ContentStatus,
            updatedAt: new Date().toISOString().split('T')[0],
          }
        : item
    ),
  })),
  
  duplicateContent: (id) => set((state) => {
    const original = state.contents.find((item) => item.id === id);
    if (!original) return state;
    
    const newId = Date.now().toString();
    return {
      contents: [
        ...state.contents,
        {
          ...original,
          id: newId,
          title: `${original.title} (Copy)`,
          status: 'draft' as ContentStatus,
          publishDate: undefined,
          scheduleDate: undefined,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        },
      ],
      analytics: {
        ...state.analytics,
        [newId]: generateMockAnalytics(newId),
      },
    };
  }),

  getAnalytics: (id) => {
    const state = get();
    return state.analytics[id] || generateMockAnalytics(id);
  },
}));
