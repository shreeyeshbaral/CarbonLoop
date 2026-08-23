import { AssetStatus, UserRole } from "@/types";

// ===================================================
// CARBONLOOP — Finite State Machine & Governance Rules
// ===================================================

export interface StateTransitionResult {
  allowed: boolean;
  nextState?: AssetStatus;
  errorMessage?: string;
}

/**
 * Permitted forward state transitions in the circular lifecycle
 */
export const ALLOWED_TRANSITIONS: Record<AssetStatus, AssetStatus[]> = {
  AVAILABLE: ["REQUESTED"],
  REQUESTED: ["IN_REVIEW"],
  IN_REVIEW: ["APPROVED", "AVAILABLE"], // Approved or Rejected back to Available
  APPROVED: ["DATA_WIPE_PENDING", "TRANSFER_SCHEDULED"],
  DATA_WIPE_PENDING: ["DATA_WIPED"],
  DATA_WIPED: ["TRANSFER_SCHEDULED"],
  TRANSFER_SCHEDULED: ["IN_TRANSIT"],
  IN_TRANSIT: ["TRANSFERRED"],
  TRANSFERRED: [],
  RECYCLED: [],
};

/**
 * Role permissions matrix required to authorize specific transitions
 */
export const TRANSITION_ROLE_GUARDS: Partial<Record<AssetStatus, UserRole[]>> = {
  IN_REVIEW: ["ADMIN", "DEPARTMENT_MANAGER"],
  APPROVED: ["ADMIN", "DEPARTMENT_MANAGER"],
  DATA_WIPED: ["IT_OFFICER", "ADMIN"],
  TRANSFER_SCHEDULED: ["ADMIN", "DEPARTMENT_MANAGER"],
  IN_TRANSIT: ["ADMIN", "DEPARTMENT_MANAGER"],
  TRANSFERRED: ["ADMIN", "DEPARTMENT_MANAGER", "REQUESTER"],
};

/**
 * Validates whether a state transition is legal given the asset's current state, data-wipe flag, and user role
 */
export function validateStateTransition(
  currentState: AssetStatus,
  targetState: AssetStatus,
  dataWipeRequired: boolean,
  dataWipeCompleted: boolean,
  userRole: UserRole
): StateTransitionResult {
  // 1. Check if transition exists in graph
  const allowedNext = ALLOWED_TRANSITIONS[currentState] || [];
  if (!allowedNext.includes(targetState)) {
    return {
      allowed: false,
      errorMessage: `Illegal transition: Cannot move asset directly from ${currentState} to ${targetState}.`,
    };
  }

  // 2. Data-Wipe Guard: Cannot schedule transfer if data wipe is required but pending
  if (
    targetState === "TRANSFER_SCHEDULED" &&
    dataWipeRequired &&
    !dataWipeCompleted
  ) {
    return {
      allowed: false,
      errorMessage:
        "IT Security Guard: Asset contains sensitive storage. NIST 800-88 Data-Wipe verification must be signed before scheduling transfer.",
    };
  }

  // 3. Role Authorization Guard
  const requiredRoles = TRANSITION_ROLE_GUARDS[targetState];
  if (requiredRoles && !requiredRoles.includes(userRole)) {
    return {
      allowed: false,
      errorMessage: `Permission Denied: User role '${userRole}' is not authorized to transition state to ${targetState}. Required roles: ${requiredRoles.join(", ")}.`,
    };
  }

  return {
    allowed: true,
    nextState: targetState,
  };
}
