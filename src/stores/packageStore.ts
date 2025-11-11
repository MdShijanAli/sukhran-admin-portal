import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { subscriptionPackages } from '@/data/mockData';

export interface Package {
  id: string;
  name: string;
  type: string;
  frequency: string;
  size: string;
  description: string;
  photo: string;
  products: string[];
  productDetails: Array<{ id: string; name: string; price: number }>;
  price: number;
  redeemCoins: number;
  subscribers: number;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
}

interface PackageState {
  packages: Package[];
  addPackage: (pkg: Omit<Package, 'id' | 'createdAt' | 'updatedAt' | 'subscribers'>) => void;
  updatePackage: (id: string, pkg: Partial<Package>) => void;
  deletePackage: (id: string) => void;
  duplicatePackage: (id: string) => void;
  getPackageById: (id: string) => Package | undefined;
}

// Transform mock data to match our Package interface
const initialPackages: Package[] = subscriptionPackages.map((pkg, index) => ({
  id: pkg.id,
  name: pkg.name,
  type: 'individual',
  frequency: pkg.frequency,
  size: 'medium',
  description: `Premium ${pkg.frequency} subscription package`,
  photo: '',
  products: pkg.products,
  productDetails: [],
  price: pkg.price,
  redeemCoins: Math.floor(pkg.price * 0.01),
  subscribers: pkg.subscribers,
  status: pkg.status as 'active' | 'inactive' | 'draft',
  createdAt: new Date(Date.now() - (index * 86400000)).toISOString(),
  updatedAt: new Date().toISOString(),
}));

export const usePackageStore = create<PackageState>()(
  persist(
    (set, get) => ({
      packages: initialPackages,
      addPackage: (pkg) => {
        const newPackage: Package = {
          ...pkg,
          id: `PKG-${Date.now()}`,
          subscribers: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          packages: [newPackage, ...state.packages],
        }));
      },
      updatePackage: (id, updates) => {
        set((state) => ({
          packages: state.packages.map((pkg) =>
            pkg.id === id
              ? { ...pkg, ...updates, updatedAt: new Date().toISOString() }
              : pkg
          ),
        }));
      },
      deletePackage: (id) => {
        set((state) => ({
          packages: state.packages.filter((pkg) => pkg.id !== id),
        }));
      },
      duplicatePackage: (id) => {
        const packageToDuplicate = get().packages.find((pkg) => pkg.id === id);
        if (packageToDuplicate) {
          const newPackage: Package = {
            ...packageToDuplicate,
            id: `PKG-${Date.now()}`,
            name: `${packageToDuplicate.name} (Copy)`,
            subscribers: 0,
            status: 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          set((state) => ({
            packages: [newPackage, ...state.packages],
          }));
        }
      },
      getPackageById: (id) => {
        return get().packages.find((pkg) => pkg.id === id);
      },
    }),
    {
      name: 'package-storage',
    }
  )
);
