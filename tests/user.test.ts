import { describe, it, expect, beforeEach } from 'bun:test';
import { app } from '../src/app';
import { db } from '../src/db';
import { users, sessions } from '../src/db/schema';

const TEST_USER = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

describe('User API Tests', () => {
  beforeEach(async () => {
    // Clear data before each test scenario for consistency
    await db.delete(sessions);
    await db.delete(users);
  });

  describe('POST /api/users (Register)', () => {
    it('should register a new user successfully', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(TEST_USER)
        })
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data).toBe('OK');
    });

    it('should fail if email is already registered', async () => {
      // First registration
      await app.handle(
        new Request('http://localhost/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(TEST_USER)
        })
      );

      // Second registration with same email
      const response = await app.handle(
        new Request('http://localhost/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(TEST_USER)
        })
      );

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Email sudah terdaftar');
    });

    it('should fail if email format is invalid', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...TEST_USER, email: 'invalid-email' })
        })
      );

      expect(response.status).toBe(422);
    });

    it('should fail if payload is incomplete', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: TEST_USER.name, email: TEST_USER.email })
        })
      );

      expect(response.status).toBe(422);
    });

    it('should fail if name is longer than 255 characters', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...TEST_USER, name: 'a'.repeat(256) })
        })
      );

      expect(response.status).toBe(422);
    });
  });

  describe('POST /api/users/login (Login)', () => {
    beforeEach(async () => {
      // Register a user for login tests
      await app.handle(
        new Request('http://localhost/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(TEST_USER)
        })
      );
    });

    it('should login successfully with correct credentials', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: TEST_USER.email, password: TEST_USER.password })
        })
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data).toBeDefined();
      expect(typeof data.data).toBe('string');
    });

    it('should fail with unregistered email', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'wrong@example.com', password: TEST_USER.password })
        })
      );

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Email atau password salah');
    });

    it('should fail with incorrect password', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: TEST_USER.email, password: 'wrongpassword' })
        })
      );

      expect(response.status).toBe(401);
    });
  });

  describe('Authenticated Endpoints', () => {
    let token: string;

    beforeEach(async () => {
      // Register and Login to get token
      await app.handle(
        new Request('http://localhost/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(TEST_USER)
        })
      );

      const loginRes = await app.handle(
        new Request('http://localhost/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: TEST_USER.email, password: TEST_USER.password })
        })
      );
      const loginData = await loginRes.json();
      token = loginData.data;
    });

    describe('GET /api/users/current', () => {
      it('should get current user with valid token', async () => {
        const response = await app.handle(
          new Request('http://localhost/api/users/current', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        );

        expect(response.status).toBe(200);
        const result = await response.json();
        expect(result.data.email).toBe(TEST_USER.email);
        expect(result.data.name).toBe(TEST_USER.name);
      });

      it('should fail without authorization header', async () => {
        const response = await app.handle(
          new Request('http://localhost/api/users/current')
        );

        expect(response.status).toBe(401);
      });

      it('should fail with invalid token', async () => {
        const response = await app.handle(
          new Request('http://localhost/api/users/current', {
            headers: { 'Authorization': 'Bearer invalid-token' }
          })
        );

        expect(response.status).toBe(401);
      });
    });

    describe('DELETE /api/users/logout', () => {
      it('should logout successfully with valid token', async () => {
        const response = await app.handle(
          new Request('http://localhost/api/users/logout', {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          })
        );

        expect(response.status).toBe(200);
        const result = await response.json();
        expect(result.data).toBe('OK');

        // Verify token is no longer valid
        const verifyRes = await app.handle(
          new Request('http://localhost/api/users/current', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        );
        expect(verifyRes.status).toBe(401);
      });

      it('should fail logout without authorization header', async () => {
        const response = await app.handle(
          new Request('http://localhost/api/users/logout', {
            method: 'DELETE'
          })
        );

        expect(response.status).toBe(401);
      });

      it('should fail logout with already used/invalid token', async () => {
        // Logout first
        await app.handle(
          new Request('http://localhost/api/users/logout', {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          })
        );

        // Try to logout again with same token
        const response = await app.handle(
          new Request('http://localhost/api/users/logout', {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          })
        );

        expect(response.status).toBe(401);
      });
    });
  });
});
