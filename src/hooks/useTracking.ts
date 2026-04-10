import { useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { rtdb } from '../services/firebaseConfig';
import { useVehicleStore, Vehicle } from '../store/useVehicleStore';

const initialVehicles: Vehicle[] = [
  { id: '1', name: 'Caminhão 01', driver: 'Carlos Silva', speed: 87, latitude: -23.55, longitude: -46.63, status: 'online', updatedAt: new Date() },
  { id: '2', name: 'Van 02', driver: 'Ana Souza', speed: 0, latitude: -23.56, longitude: -46.64, status: 'offline', updatedAt: new Date() },
  { id: '3', name: 'Moto 03', driver: 'Pedro Lima', speed: 112, latitude: -23.57, longitude: -46.65, status: 'alert', updatedAt: new Date() },
  { id: '4', name: 'Caminhão 04', driver: 'Julia Costa', speed: 64, latitude: -23.58, longitude: -46.66, status: 'online', updatedAt: new Date() },
];

export function useTracking() {
  const { setVehicles } = useVehicleStore();

  useEffect(() => {
    const vehiclesRef = ref(rtdb, 'vehicles');

    const unsubscribe = onValue(vehiclesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: Vehicle[] = Object.values(data);
        setVehicles(list);
      } else {
        initialVehicles.forEach((v) => {
          set(ref(rtdb, `vehicles/${v.id}`), v);
        });
      }
    });

    const interval = setInterval(() => {
      initialVehicles.forEach((v) => {
        const updated = {
          ...v,
          speed: v.status === 'online'
            ? Math.floor(Math.random() * 40) + 60
            : v.status === 'alert'
            ? Math.floor(Math.random() * 30) + 100
            : 0,
          latitude: v.latitude + (Math.random() - 0.5) * 0.001,
          longitude: v.longitude + (Math.random() - 0.5) * 0.001,
          updatedAt: new Date().toISOString(),
        };
        set(ref(rtdb, `vehicles/${v.id}`), updated);
      });
    }, 3000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);
}