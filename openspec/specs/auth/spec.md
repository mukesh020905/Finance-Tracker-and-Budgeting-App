# Authentication Specification

## Purpose
This specification defines the behavior of the authentication system for the BudgetWise application, including user registration and sign-in processes.

## Requirements
### Requirement: User Registration (Sign Up)
The system SHALL allow a user to register with a unique username, unique email, and password. By default, registered users SHALL have the role `ROLE_USER`. The system SHALL reject registration if the username or email is already taken.

#### Scenario: Successful User Registration
- **GIVEN** the database does not contain a user with username "newuser" or email "newuser@example.com"
- **WHEN** a registration request is sent with username "newuser", email "newuser@example.com", and password "Password123"
- **THEN** the system SHALL create the user account with role `ROLE_USER` and return a success message.

#### Scenario: Registration with Existing Username
- **GIVEN** the database contains a user with username "existinguser"
- **WHEN** a registration request is sent with username "existinguser", email "new@example.com", and password "Password123"
- **THEN** the system SHALL reject the request with a "Username is already taken" error message.

### Requirement: User Sign In (Login)
The system SHALL authenticate users using their username and password. Upon successful authentication, the system SHALL return a valid JSON Web Token (JWT) along with user profile details (id, username, email, roles).

#### Scenario: Successful User Login
- **GIVEN** the database contains a registered user with username "registereduser" and password "Password123"
- **WHEN** a login request is sent with username "registereduser" and password "Password123"
- **THEN** the system SHALL return an HTTP 200 OK status containing a valid JWT token.
