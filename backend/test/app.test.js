import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockState = {
  user: null,
  notificationItems: [],
  unreadCount: 0
};

class MockUser {
  constructor(data) {
    this._id = data._id || "user-1";
    this.fullName = data.fullName;
    this.email = data.email;
    this.role = data.role || "student";
    this.university = data.university || "";
    this.passwordHash = data.passwordHash || "";
    this.tokenVersion = data.tokenVersion || 0;
    this.isVerified = data.isVerified || false;
    this.notificationSettings = data.notificationSettings || {};
    this.privacySettings = data.privacySettings || {};
    this.followers = data.followers || [];
    this.following = data.following || [];
    this.savedEvents = data.savedEvents || [];
  }

  async setPassword(password) {
    this.passwordHash = `hashed-${password}`;
  }

  async comparePassword(password) {
    return this.passwordHash === `hashed-${password}` || password === "current-password";
  }

  async save() {
    mockState.user = this;
    return this;
  }

  toObject() {
    return { ...this };
  }

  static async findOne(query) {
    if (query.email === "existing@uniconnect.test") {
      return new MockUser({
        _id: "existing-user",
        fullName: "Existing User",
        email: query.email,
        passwordHash: "hashed-password123"
      });
    }

    return null;
  }

  static async findById(id) {
    if (!mockState.user) {
      mockState.user = new MockUser({
        _id: id,
        fullName: "Demo User",
        email: "demo@uniconnect.test",
        passwordHash: "hashed-current-password"
      });
    }

    mockState.user._id = id;
    return mockState.user;
  }
}

const notificationQuery = {
  populate() {
    return this;
  },
  sort() {
    return this;
  },
  skip() {
    return this;
  },
  limit() {
    return Promise.resolve(mockState.notificationItems);
  }
};

const notificationModel = {
  find: vi.fn(() => notificationQuery),
  countDocuments: vi.fn(async () => mockState.unreadCount),
  findOneAndUpdate: vi.fn(async () => ({
    _id: "notif-1",
    type: "event",
    text: "Updated notification",
    targetUrl: "/events/demo-hackathon",
    toObject() {
      return this;
    }
  })),
  updateMany: vi.fn(async () => ({ modifiedCount: 3 })),
  insertMany: vi.fn()
};

vi.mock("../src/models/User.js", () => ({ User: MockUser }));
vi.mock("../src/models/Notification.js", () => ({ Notification: notificationModel }));
vi.mock("../src/middleware/auth.js", () => ({
  requireAuth: (req, res, next) => {
    req.user = mockState.user || new MockUser({
      _id: "auth-user",
      fullName: "Auth User",
      email: "auth@uniconnect.test",
      passwordHash: "hashed-current-password"
    });
    next();
  },
  requireRole: () => (req, res, next) => next()
}));

const { default: app } = await import("../src/app.js");

beforeEach(() => {
  mockState.user = new MockUser({
    _id: "user-1",
    fullName: "Demo User",
    email: "demo@uniconnect.test",
    passwordHash: "hashed-current-password",
    notificationSettings: {},
    privacySettings: {}
  });
  mockState.notificationItems = [
    {
      _id: "notif-1",
      type: "event",
      text: "Event registration confirmed",
      targetUrl: "/events/demo-hackathon",
      isRead: false,
      createdAt: new Date().toISOString(),
      toObject() {
        return this;
      }
    }
  ];
  mockState.unreadCount = 1;
  vi.clearAllMocks();
});

describe("backend routes", () => {
  it("registers a new user and returns a token", async () => {
    const response = await request(app).post("/api/auth/register").send({
      fullName: "Amina Khan",
      email: "amina.khan@uniconnect.test",
      password: "password123",
      role: "student",
      university: "University of Central Punjab"
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeTruthy();
    expect(response.body.user.email).toBe("amina.khan@uniconnect.test");
  });

  it("updates password on the protected route", async () => {
    const response = await request(app).patch("/api/auth/change-password").send({
      currentPassword: "current-password",
      newPassword: "new-password123",
      confirmPassword: "new-password123"
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Password updated successfully");
    expect(response.body.token).toBeTruthy();
  });

  it("returns recent notifications with navigation targets", async () => {
    const response = await request(app).get("/api/notifications/recent");

    expect(response.status).toBe(200);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].targetUrl).toBe("/events/demo-hackathon");
  });

  it("marks all notifications as read", async () => {
    const response = await request(app).patch("/api/notifications/read-all");

    expect(response.status).toBe(200);
    expect(response.body.modifiedCount).toBe(3);
  });
});
