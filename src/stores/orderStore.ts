import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { orders } from '@/data/mockData';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: string;
  total: number;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryAgent?: string;
  address?: string;
  notes?: string;
}

interface OrderState {
  orders: Order[];
  updateOrderStatus: (id: string, status: Order['status']) => void;
  assignDeliveryAgent: (id: string, agent: string) => void;
  cancelOrder: (id: string) => void;
  getOrderById: (id: string) => Order | undefined;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: orders.map(order => ({
        ...order,
        status: order.status as Order['status'],
      })),
      updateOrderStatus: (id, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, status } : order
          ),
        }));
      },
      assignDeliveryAgent: (id, agent) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, deliveryAgent: agent } : order
          ),
        }));
      },
      cancelOrder: (id) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, status: 'cancelled' } : order
          ),
        }));
      },
      getOrderById: (id) => {
        return get().orders.find((order) => order.id === id);
      },
    }),
    {
      name: 'order-storage',
    }
  )
);
