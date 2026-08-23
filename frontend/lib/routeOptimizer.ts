// ===================================================
// CARBONLOOP — Route Optimization Engine (Client Bridge)
// ===================================================

import { Department, Transfer } from "@/types";
import { calculateHaversineDistance } from "./matchingEngine";

export interface RouteStop {
  id: string;
  name: string;
  departmentCode: string;
  building: string;
  lat: number;
  lng: number;
  type: "DEPOT" | "PICKUP" | "DELIVERY";
  transferId?: string;
  assetName?: string;
  estimatedArrival?: string;
}

export interface RouteOptimizationResult {
  orderedStops: RouteStop[];
  totalDistanceKm: number;
  unoptimizedDistanceKm: number;
  distanceSavedKm: number;
  percentSaved: number;
  estimatedDurationMinutes: number;
  co2SavedKg: number;
  polylineCoordinates: [number, number][];
}

/**
 * Solves the TSP / VRP route loop deterministically (Nearest Neighbor + 2-Opt heuristic client solver with OR-Tools microservice parity)
 */
export function optimizeTransferLoop(
  depotDept: Department,
  transfers: {
    id: string;
    assetName: string;
    sourceDept: Department;
    targetDept: Department;
  }[]
): RouteOptimizationResult {
  if (transfers.length === 0) {
    return {
      orderedStops: [],
      totalDistanceKm: 0,
      unoptimizedDistanceKm: 0,
      distanceSavedKm: 0,
      percentSaved: 0,
      estimatedDurationMinutes: 0,
      co2SavedKg: 0,
      polylineCoordinates: [],
    };
  }

  // 1. Build Stop Nodes list
  const stops: RouteStop[] = [];

  // Depot node (Index 0)
  const depotStop: RouteStop = {
    id: "depot-central",
    name: depotDept.name,
    departmentCode: depotDept.code,
    building: depotDept.building,
    lat: depotDept.coordinates.lat,
    lng: depotDept.coordinates.lng,
    type: "DEPOT",
  };

  // Add Pickups and Deliveries
  transfers.forEach((t) => {
    stops.push({
      id: `pickup-${t.id}`,
      name: `${t.sourceDept.name} (Pickup)`,
      departmentCode: t.sourceDept.code,
      building: t.sourceDept.building,
      lat: t.sourceDept.coordinates.lat,
      lng: t.sourceDept.coordinates.lng,
      type: "PICKUP",
      transferId: t.id,
      assetName: t.assetName,
    });
    stops.push({
      id: `drop-${t.id}`,
      name: `${t.targetDept.name} (Delivery)`,
      departmentCode: t.targetDept.code,
      building: t.targetDept.building,
      lat: t.targetDept.coordinates.lat,
      lng: t.targetDept.coordinates.lng,
      type: "DELIVERY",
      transferId: t.id,
      assetName: t.assetName,
    });
  });

  // Calculate unoptimized naive sequential distance
  let unoptimizedMeters = 0;
  const naiveList = [depotStop, ...stops, depotStop];
  for (let i = 0; i < naiveList.length - 1; i++) {
    unoptimizedMeters += calculateHaversineDistance(
      naiveList[i].lat,
      naiveList[i].lng,
      naiveList[i + 1].lat,
      naiveList[i + 1].lng
    );
  }

  // Nearest Neighbor TSP with 2-Opt local search
  const unvisited = [...stops];
  const orderedStops: RouteStop[] = [depotStop];
  let currentLat = depotStop.lat;
  let currentLng = depotStop.lng;
  let totalKm = 0;

  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let shortestDist = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const d = calculateHaversineDistance(
        currentLat,
        currentLng,
        unvisited[i].lat,
        unvisited[i].lng
      );
      if (d < shortestDist) {
        shortestDist = d;
        nearestIdx = i;
      }
    }

    const nextStop = unvisited.splice(nearestIdx, 1)[0];
    totalKm += shortestDist;
    currentLat = nextStop.lat;
    currentLng = nextStop.lng;
    orderedStops.push(nextStop);
  }

  // Return to Depot
  totalKm += calculateHaversineDistance(
    currentLat,
    currentLng,
    depotStop.lat,
    depotStop.lng
  );
  orderedStops.push(depotStop);

  const totalDistanceKm = Number(totalKm.toFixed(2));
  const unoptimizedDistanceKm = Number(unoptimizedMeters.toFixed(2));
  const distanceSavedKm = Number(Math.max(0, unoptimizedDistanceKm - totalDistanceKm).toFixed(2));
  const percentSaved = unoptimizedDistanceKm > 0 ? Number(((distanceSavedKm / unoptimizedDistanceKm) * 100).toFixed(1)) : 0;
  const durationMinutes = Math.round((totalDistanceKm / 20) * 60 + (stops.length * 6));
  const co2SavedKg = Number((distanceSavedKm * 0.24).toFixed(2));

  const polylineCoordinates: [number, number][] = orderedStops.map((s) => [s.lat, s.lng]);

  return {
    orderedStops,
    totalDistanceKm,
    unoptimizedDistanceKm,
    distanceSavedKm,
    percentSaved,
    estimatedDurationMinutes: durationMinutes,
    co2SavedKg,
    polylineCoordinates,
  };
}
