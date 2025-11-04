import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Truck,
  DollarSign,
  Gift,
  HeadphonesIcon,
  BarChart3,
  Heart,
  Ticket,
  FileText,
  UserPlus,
  RefreshCw,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Bell,
  Coins,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSidebarStore } from '@/stores/sidebarStore';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'nav.dashboard', path: '/dashboard' },
  { icon: Users, label: 'nav.users', path: '/users' },
  { icon: Package, label: 'nav.products', path: '/products' },
  { icon: Gift, label: 'nav.packages', path: '/packages' },
  { icon: ShoppingCart, label: 'nav.orders', path: '/orders' },
  { icon: Truck, label: 'nav.delivery', path: '/delivery' },
  { icon: DollarSign, label: 'nav.financial', path: '/financial' },
  { icon: Coins, label: 'nav.loyaltyRewards', path: '/loyalty-rewards' },
  { icon: HeadphonesIcon, label: 'nav.support', path: '/support' },
  { icon: BarChart3, label: 'nav.analytics', path: '/analytics' },
  { icon: Ticket, label: 'nav.coupons', path: '/coupons' },
  { icon: FileText, label: 'nav.content', path: '/content' },
  { icon: UserPlus, label: 'nav.family', path: '/family' },
  { icon: RefreshCw, label: 'nav.returns', path: '/returns' },
  { icon: Shield, label: 'nav.roles', path: '/role-management' },
  { icon: Bell, label: 'nav.notifications', path: '/notifications' },
  { icon: Settings, label: 'nav.settings', path: '/settings' },
  { icon: FileText, label: 'nav.reports', path: '/reports' },
];

export default function Sidebar() {
  const { t } = useTranslation();
  const { isCollapsed, toggleSidebar } = useSidebarStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!isCollapsed && (
            <h1 className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
              Admin Panel
            </h1>
          )}
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-2 hover:bg-sidebar-accent transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 text-sidebar-foreground" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-sidebar-foreground" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200',
                      'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                        : 'text-sidebar-foreground'
                    )
                  }
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span>{t(item.label)}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
