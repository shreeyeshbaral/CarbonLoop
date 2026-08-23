import math
from typing import List, Dict, Any, Tuple
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great circle distance between two points in meters."""
    R = 6371000  # Radius of the earth in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) *
         math.sin(delta_lambda / 2.0) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def create_distance_matrix(locations: List[Tuple[float, float]]) -> List[List[int]]:
    """Build integer distance matrix in meters for OR-Tools."""
    matrix = []
    for from_node in locations:
        row = []
        for to_node in locations:
            dist = haversine_distance(from_node[0], from_node[1], to_node[0], to_node[1])
            row.append(int(dist))
        matrix.append(row)
    return matrix

class ORToolsRouteSolver:
    """
    Solves Institutional Reverse Logistics Vehicle Routing Problem using Google OR-Tools.
    """

    def optimize_route(
        self,
        depot: Dict[str, Any],
        stops: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        if not stops:
            return {
                "orderedStops": [],
                "totalDistanceKm": 0.0,
                "unoptimizedDistanceKm": 0.0,
                "distanceSavedKm": 0.0,
                "percentSaved": 0.0,
                "estimatedDurationMinutes": 0,
                "co2SavedKg": 0.0,
            }

        # All locations: Depot is index 0, followed by stops
        all_nodes = [depot] + stops
        coordinates = [(node["lat"], node["lng"]) for node in all_nodes]
        distance_matrix = create_distance_matrix(coordinates)

        num_nodes = len(all_nodes)
        num_vehicles = 1
        depot_idx = 0

        # Create the routing index manager
        manager = pywrapcp.RoutingIndexManager(num_nodes, num_vehicles, depot_idx)
        routing = pywrapcp.RoutingModel(manager)

        def distance_callback(from_index, to_index):
            from_node = manager.IndexToNode(from_index)
            to_node = manager.IndexToNode(to_index)
            return distance_matrix[from_node][to_node]

        transit_callback_index = routing.RegisterTransitCallback(distance_callback)
        routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

        # Setting first solution heuristic
        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = (
            routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
        )

        # Solve the problem
        solution = routing.SolveWithParameters(search_parameters)

        if not solution:
            # Fallback to standard sequential order if no solution found
            return self._build_fallback_result(all_nodes, distance_matrix)

        # Extract optimal route order
        index = routing.Start(0)
        ordered_indices = []
        total_distance_meters = 0

        while not routing.IsEnd(index):
            node_idx = manager.IndexToNode(index)
            ordered_indices.append(node_idx)
            previous_index = index
            index = solution.Value(routing.NextVar(index))
            total_distance_meters += routing.GetArcCostForVehicle(previous_index, index, 0)

        # Complete loop back to depot
        ordered_indices.append(manager.IndexToNode(index))

        # Calculate unoptimized sequential distance for comparison
        unoptimized_meters = 0
        for i in range(len(coordinates)):
            next_i = (i + 1) % len(coordinates)
            unoptimized_meters += distance_matrix[i][next_i]

        optimized_km = round(total_distance_meters / 1000.0, 2)
        unoptimized_km = round(unoptimized_meters / 1000.0, 2)
        distance_saved_km = max(0.0, round(unoptimized_km - optimized_km, 2))
        percent_saved = round((distance_saved_km / unoptimized_km) * 100, 1) if unoptimized_km > 0 else 0.0

        # Estimated duration: 25 km/h average speed on campus + 5 mins dwell time per stop
        travel_hours = (optimized_km / 25.0)
        duration_minutes = int(round(travel_hours * 60 + len(stops) * 5))
        co2_saved_kg = round(distance_saved_km * 0.24, 2) # ~240g CO2 per km for utility van

        ordered_stops_result = []
        for idx in ordered_indices:
            node = all_nodes[idx]
            ordered_stops_result.append({
                "name": node.get("name", "Campus Node"),
                "building": node.get("building", "Main Block"),
                "lat": node["lat"],
                "lng": node["lng"],
                "type": "DEPOT" if idx == 0 else "TRANSFER_STOP",
                "transferId": node.get("transferId"),
                "assetName": node.get("assetName"),
            })

        return {
            "orderedStops": ordered_stops_result,
            "totalDistanceKm": optimized_km,
            "unoptimizedDistanceKm": unoptimized_km,
            "distanceSavedKm": distance_saved_km,
            "percentSaved": percent_saved,
            "estimatedDurationMinutes": duration_minutes,
            "co2SavedKg": co2_saved_kg,
            "solver": "Google OR-Tools VRP / TSP Engine",
        }

    def _build_fallback_result(self, all_nodes, distance_matrix):
        total_m = sum(distance_matrix[i][(i + 1) % len(all_nodes)] for i in range(len(all_nodes)))
        km = round(total_m / 1000.0, 2)
        return {
            "orderedStops": all_nodes,
            "totalDistanceKm": km,
            "unoptimizedDistanceKm": km,
            "distanceSavedKm": 0.0,
            "percentSaved": 0.0,
            "estimatedDurationMinutes": int(km * 4 + len(all_nodes) * 5),
            "co2SavedKg": 0.0,
            "solver": "Heuristic Fallback",
        }

solver = ORToolsRouteSolver()
