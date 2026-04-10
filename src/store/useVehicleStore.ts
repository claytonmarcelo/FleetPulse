import { create } from 'zustand';

export type Vehicle = {
  id: string;
  name: string;
  driver: string;
  speed: number;
  latitude: number;
  longitude: number;
  status: 'online' | 'offline' | 'alert';
  updatedAt: Date;
};

type VehicleStore = {
  vehicles: Vehicle[];
  selected: Vehicle | null;
  setVehicles: (vehicles: Vehicle[]) => void;
  selectVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (id: string, data: Partial<Vehicle>) => void;
};

export const useVehicleStore = create<VehicleStore>((set) => ({
  vehicles: [],
  selected: null,
  setVehicles: (vehicles) => set({ vehicles }),
  selectVehicle: (vehicle) => set({ selected: vehicle }),
  updateVehicle: (id, data) =>
    set((state) => ({
      vehicles: state.vehicles.map((v) =>
        v.id === id ? { ...v, ...data } : v
      ),
    })),
}));