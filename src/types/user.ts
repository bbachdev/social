// Enum to define all states a user account can be in (primarily used for login messages and user management)
export enum UserStatus {
  // User is active and can log in
  Active = "active",
  // User is inactive and cannot log in
  Inactive = "inactive",
  // User is pending and cannot log in
  Reserved = "reserved",
  // User is banned and cannot log in
  Banned = "banned",
}

// Enum to define status of a user's 2FA setup
export enum TwoFactorStatus {
  // User has not setup 2FA
  NotSetup = "not_setup",
  // User has selected 2FA and awaiting verification
  Setup = "pending",
  // User has setup 2FA and has verified it
  Verified = "verified",
}

// All user info needed to create a new user
export interface SignUpData {
  userId: string,
  username: string,
  email: string,
  birthDate: Date,
  password: string,
  twoFactorSecret: string,
  twoFactorStatus: TwoFactorStatus
}