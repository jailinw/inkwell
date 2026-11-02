// server/src/services/auth.service.js
//
// Implements processing narratives exactly, in order.

import bcrypt from "bcrypt";

import { UserRepository } from "../repositories/user.repository.js";

import {
  assertNonEmpty,
  ValidationError
} from "../utils/validation.js";

import { TokenService } from "./token.service.js";
import { logger } from "../lib/logger.js";

class EmailAlreadyRegisteredError extends Error {}
class WeakPasswordError extends Error {}
class InvalidCredentialsError extends Error {}

const BCRYPT_COST_FACTOR = 10;
const MIN_PASSWORD_LENGTH = 8;

function toPublicUser(user) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName
  };
}

export const AuthService = {
  async register({ email, displayName, password }) {
    assertNonEmpty(email, "email", "MISSING_EMAIL");
    assertNonEmpty(
      displayName,
      "displayName",
      "MISSING_DISPLAY_NAME"
    );
    assertNonEmpty(password, "password", "MISSING_PASSWORD");

    const existing = await UserRepository.findByEmail(email);

    if (existing) {
      throw new EmailAlreadyRegisteredError();
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new WeakPasswordError();
    }

    const passwordHash = await bcrypt.hash(
      password,
      BCRYPT_COST_FACTOR
    );

    let user;

    try {
      user = await UserRepository.create({
        email,
        displayName,
        passwordHash
      });
    } catch (err) {
      // Defense in depth (Lecture 4): the DB's @unique
      // constraint may reject a race-condition duplicate that slipped
      // past the check above.
      throw new EmailAlreadyRegisteredError();
    }

    const tokens = TokenService.issueTokens(user);

    return {
      user: toPublicUser(user),
      ...tokens
    };
  },

  async login({ email, password }) {
    const user = await UserRepository.findByEmail(email);

    // Short-circuit if the user does not exist, so bcrypt.compare
    // only runs when there is a password hash to check.
    if (
      !user ||
      !(await bcrypt.compare(password, user.passwordHash))
    ) {
      // Workshop 16, A09: record failed login attempts.
      // Structured fields let monitoring tools search by event
      // or count failed attempts for a particular email address.
      // Never log passwords, password hashes, or tokens.
      logger.warn(
        { event: "auth.login.failed", email },
        "Failed login attempt"
      );

      // Return the same error for an unknown email or wrong password.
      throw new InvalidCredentialsError();
    }

    const tokens = TokenService.issueTokens(user);

    return {
      user: toPublicUser(user),
      ...tokens
    };
  }
};

export {
  EmailAlreadyRegisteredError,
  WeakPasswordError,
  InvalidCredentialsError,
  ValidationError
};