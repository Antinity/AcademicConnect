# AcademicConnect API Documentation

## Overview
This document outlines the RESTful API endpoints for the AcademicConnect platform, which handles authentication, profiles (students, teachers, schools), reviews for teachers, and direct messaging between users.

---

## Base URL
All requests should be prefixed by the base API route:
`http://localhost:<PORT>/api`

---

## Authentication
Most endpoints in the AcademicConnect API are protected and require a JSON Web Token (JWT).
When logging in or registering, a `token` is returned. Pass this token in the `Authorization` header of your HTTP request.

**Header Format:**
```
Authorization: Bearer <YOUR_JWT_TOKEN>
```

---

## 1. Authentication Endpoints

### 1.1. Register a New User
Create a new user account.

- **URL:** `/auth/register`
- **Method:** `POST`
- **Auth Required:** No

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "strongPassword123",
  "role": "student" // Allowed values: "student", "teacher", "school"
}
```

**Success Response (201 Created):**
```json
{
  "user": {
    "id": "60d0fe4f5311236168a109ca",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "student"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI..."
}
```

### 1.2. Login
Authenticate an existing user to receive a JWT.

- **URL:** `/auth/login`
- **Method:** `POST`
- **Auth Required:** No

**Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "strongPassword123"
}
```

**Success Response (200 OK):**
```json
{
  "user": {
    "id": "60d0fe4f5311236168a109ca",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "student"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI..."
}
```

---

## 2. Profile Endpoints

### 2.1. Get All Profiles
Fetch a list of profiles. You can optionally filter by role (e.g., to find only teachers).

- **URL:** `/profiles?role=teacher` (Query parameter `role` is optional)
- **Method:** `GET`
- **Auth Required:** No (Depends on requirements, currently public)

**Success Response (200 OK):**
```json
[
  {
    "_id": "60d0fe4f5311236168a109cb",
    "userId": {
      "_id": "60d0fe4f5311236168a109ca",
      "name": "Jane Teacher",
      "role": "teacher",
      "email": "jane.teach@example.com"
    },
    "headline": "Mathematics Tutor",
    "location": "New York, NY",
    "bio": "Experienced math tutor.",
    "subjects": ["Algebra", "Calculus"],
    "hourlyRate": 45,
    "rating": 4.8,
    "createdAt": "2026-04-01T10:00:00Z",
    "updatedAt": "2026-04-01T10:00:00Z"
  }
]
```

### 2.2. Get Profile by User ID
Fetch a specific profile using the associated User ID.

- **URL:** `/profiles/:userId`
- **Method:** `GET`
- **Auth Required:** No

**Success Response (200 OK):**
Same object layout as above.

### 2.3. Create or Update Own Profile
Allows the logged-in user to create or update their extended profile details.

- **URL:** `/profiles`
- **Method:** `PUT`
- **Auth Required:** Yes (`Bearer <Token>`)

**Request Body (All fields optional):**
```json
{
  "headline": "Senior Physics Coach",
  "location": "Remote",
  "bio": "Focus on university-level physics.",
  "subjects": ["Physics 101", "Thermodynamics"],
  "hourlyRate": 55,
  "title": "Dr."
}
```

**Success Response (200 OK):**
Returns the updated profile object.

---

## 3. Review Endpoints

### 3.1. Get Reviews for a Teacher
Fetch all reviews for a specific teacher.

- **URL:** `/reviews/:teacherId`
- **Method:** `GET`
- **Auth Required:** No

**Success Response (200 OK):**
```json
[
  {
    "_id": "60d0fe4f5311236168a109cc",
    "teacherId": "60d0fe4f5311236168a109ca",
    "reviewer": "Lucas M.",
    "rating": 5,
    "comment": "Clear explanations and steady pacing.",
    "date": "2026-03-12T10:00:00Z",
    "createdAt": "2026-03-12T10:00:00Z",
    "updatedAt": "2026-03-12T10:00:00Z"
  }
]
```

### 3.2. Add a Review
Allows a logged-in user to post a review for a teacher.

- **URL:** `/reviews/:teacherId`
- **Method:** `POST`
- **Auth Required:** Yes (`Bearer <Token>`)

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Great with test prep! Notes were easy to follow."
}
```

**Success Response (201 Created):**
Returns the created review object.

---

## 4. Messaging & Conversations Endpoints

### 4.1. Get All Conversations
Fetch all conversations that the logged-in user is a participant of.

- **URL:** `/conversations`
- **Method:** `GET`
- **Auth Required:** Yes (`Bearer <Token>`)

**Success Response (200 OK):**
```json
[
  {
    "_id": "60d0fe4f5311236168a109cd",
    "participantIds": [
      {
        "_id": "60d0fe4f5311236168a109ca",
        "name": "Jane Teacher",
        "role": "teacher"
      },
      {
        "_id": "60d0fe4f5311236168a109cb",
        "name": "John Student",
        "role": "student"
      }
    ],
    "createdAt": "2026-04-01T10:00:00Z"
  }
]
```

### 4.2. Start a New Conversation
Initiates a conversation with another user or returns the existing conversation if one already exists between the two participants.

- **URL:** `/conversations`
- **Method:** `POST`
- **Auth Required:** Yes (`Bearer <Token>`)

**Request Body:**
```json
{
  "targetUserId": "60d0fe4f5311236168a109ca"
}
```

**Success Response (200 OK):**
Returns the conversation object (containing an array of IDs for `participantIds`).

### 4.3. Get Messages in a Conversation
Fetch the message history for a specific conversation ID.

- **URL:** `/conversations/:conversationId/messages`
- **Method:** `GET`
- **Auth Required:** Yes (`Bearer <Token>`)

**Success Response (200 OK):**
```json
[
  {
    "_id": "60d0fe4f5311236168a109ce",
    "conversationId": "60d0fe4f5311236168a109cd",
    "senderId": "60d0fe4f5311236168a109cb",
    "text": "Hi Jane, do you have time for calculus review this week?",
    "timestamp": "2026-04-01T10:05:00.000Z",
    "createdAt": "2026-04-01T10:05:00.000Z"
  }
]
```

### 4.4. Send a Message
Send a new message to a specific conversation.

- **URL:** `/conversations/:conversationId/messages`
- **Method:** `POST`
- **Auth Required:** Yes (`Bearer <Token>`)

**Request Body:**
```json
{
  "text": "Yes, I can do Thursday afternoon. What topics are you targeting?"
}
```

**Success Response (201 Created):**
Returns the newly created message object.

---

## Error Handling
If a request fails due to missing resources, bad input, or unauthorized access, the API will return a JSON object with a `message` key.

**Example 401 Unauthorized:**
```json
{
  "message": "Unauthorized"
}
```

**Example 400 Bad Request / Invalid Input:**
```json
{
  "message": "Invalid credentials"
}
```

**Example 500 Internal Server Error:**
```json
{
  "message": "Server error",
  "error": { ... }
}
```
