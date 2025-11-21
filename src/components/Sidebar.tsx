import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { useDashboard } from '../contexts/DashboardContext';
import { navigationConfig, type NavigationItem } from '../config/navigation';

const Sidebar: React.FC = () => {
  const { hasAnyPermission } = usePermissions();
  const { activeComponent, setActiveComponent } = useDashboard();

  const filterNavigationItems = (items: NavigationItem[]): NavigationItem[] => {
    return items
      .filter(item => hasAnyPermission(item.permissions))
      .map(item => ({...item,}));
  };

  const filteredNavigation = filterNavigationItems(navigationConfig);

  const isActive = (component: string) => activeComponent === component;

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="px-6 py-8 border-b border-gray-200">
        <h2 className="text-3xl font-light tracking-tight text-gray-900">CareFlow</h2>
        <p className="text-sm text-gray-500 mt-1">Healthcare Management</p>
      </div>
      
      <nav className="flex-1 py-6 overflow-y-auto">
        <div className="space-y-1">
          {filteredNavigation.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => setActiveComponent(item.component)}
                className={`group flex items-center gap-3 px-6 py-3 text-base font-medium transition-all duration-200 w-full text-left ${
                  isActive(item.component) 
                    ? 'text-gray-900 bg-gray-100 border-l-2 border-gray-900' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent'
                }`}
              >
                <span className="text-lg leading-none">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
              </button>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;