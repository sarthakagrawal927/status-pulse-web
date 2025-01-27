export enum UserRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INVITATION_PENDING = "INVITATION_PENDING",
  REMOVED_BY_ADMIN = "REMOVED_BY_ADMIN",
}

export const NEGATED_USER_STATUS = [UserStatus.REMOVED_BY_ADMIN];
