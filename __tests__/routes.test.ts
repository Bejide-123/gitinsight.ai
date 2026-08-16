import { beforeEach, describe, expect, it, vi } from 'vitest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const mocks = vi.hoisted(() => ({
  mockUserFindOne: vi.fn(),
  mockUserFindById: vi.fn(),
  mockUserSave: vi.fn(),
  mockReportFind: vi.fn(),
  mockChatFind: vi.fn(),
  mockReportFindOneAndUpdate: vi.fn(),
  mockChatFindOneAndUpdate: vi.fn(),
  mockAnalyzeRepository: vi.fn(),
  mockCookieGet: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  default: vi.fn(),
}));

vi.mock('@/models/User', () => {
  class MockUser {
    data: any;

    constructor(data: any) {
      this.data = data;
    }

    save = mocks.mockUserSave;

    static findOne = mocks.mockUserFindOne;
    static findById = mocks.mockUserFindById;
  }

  return { default: MockUser };
});

vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: mocks.mockCookieGet,
  }),
}));

vi.mock('@/models/Report', () => ({
  default: {
    find: mocks.mockReportFind,
    findOneAndUpdate: mocks.mockReportFindOneAndUpdate,
  },
}));

vi.mock('@/models/Chat', () => ({
  default: {
    find: mocks.mockChatFind,
    findOneAndUpdate: mocks.mockChatFindOneAndUpdate,
  },
}));

vi.mock('@/services/analysis-service', () => ({
  analyzeRepository: mocks.mockAnalyzeRepository,
}));

import { POST as loginHandler } from '@/app/api/auth/login/route';
import { POST as registerHandler } from '@/app/api/auth/register/route';
import { POST as analyseHandler } from '@/app/api/analyse/route';
import { POST as logoutHandler } from '@/app/api/auth/logout/route';
import { GET as meHandler } from '@/app/api/auth/me/route';
import { GET as healthHandler } from '@/app/api/health/route';
import { GET as historyHandler } from '@/app/api/history/route';

describe('auth and analysis API routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = 'this-is-a-secure-test-secret-for-jwt-123456';
    process.env.NODE_ENV = 'test';
    mocks.mockCookieGet.mockReturnValue({ value: '' });
  });

  it('logs in a user and returns a token when credentials are valid', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    mocks.mockUserFindOne.mockResolvedValue({
      _id: 'user-123',
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: hashedPassword,
    });

    const response = await loginHandler(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'jane@example.com', password: 'password123' }),
      })
    );

    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.message).toBe('Logged in successfully');
    expect(payload.user.email).toBe('jane@example.com');
    expect(payload.token).toBeTruthy();
    expect(response.headers.get('set-cookie')).toContain('token=');
  });

  it('rejects login when the user does not exist', async () => {
    mocks.mockUserFindOne.mockResolvedValue(null);

    const response = await loginHandler(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'missing@example.com', password: 'password123' }),
      })
    );

    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload.message).toBe('User not found');
  });

  it('rejects registration when the user already exists', async () => {
    mocks.mockUserFindOne.mockResolvedValue({ _id: 'existing-user' });

    const response = await registerHandler(
      new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'password123',
        }),
      })
    );

    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.message).toBe('User already exists');
  });

  it('returns the current user from a valid token', async () => {
    const token = jwt.sign({ id: 'user-123', name: 'Jane Doe', email: 'jane@example.com' }, process.env.JWT_SECRET as string);
    mocks.mockCookieGet.mockImplementation((name: string) => name === 'auth_token' ? { value: token } : { value: '' });
    mocks.mockUserFindById.mockReturnValue({
      select: () => ({
        _id: 'user-123',
        name: 'Jane Doe',
        email: 'jane@example.com',
      }),
    });

    const response = await meHandler(
      new Request('http://localhost/api/auth/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })
    );

    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.email).toBe('jane@example.com');
    expect(payload.name).toBe('Jane Doe');
  });

  it('clears auth cookies when logging out', async () => {
    const response = await logoutHandler();
    const cookieHeader = response.headers.get('set-cookie') || '';

    expect(response.status).toBe(200);
    expect(cookieHeader).toContain('token=');
    expect(cookieHeader).toContain('auth_token=');
  });

  it('responds successfully for the health check endpoint', async () => {
    const response = await healthHandler();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.status).toBe('ok');
  });

  it('returns a user history payload when the auth token is valid', async () => {
    const token = jwt.sign({ id: 'user-123' }, process.env.JWT_SECRET as string);
    mocks.mockReportFind.mockReturnValue({
      sort: () => ({ lean: () => Promise.resolve([{ _id: 'report-1', repoName: 'demo/repo' }]) }),
    });
    mocks.mockChatFind.mockReturnValue({
      sort: () => ({
        populate: () => ({ lean: () => Promise.resolve([{ _id: 'chat-1', report: 'report-1' }]) }),
      }),
    });

    const response = await historyHandler(
      new Request('http://localhost/api/history', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })
    );

    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.reports[0].repoName).toBe('demo/repo');
    expect(payload.chats[0].report).toBe('report-1');
  });

  it('returns 401 when the analysis request does not include a valid auth token', async () => {
    const response = await analyseHandler(
      new Request('http://localhost/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: 'https://github.com/vercel/next.js' }),
      })
    );

    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error).toBe('Unauthorized');
  });

  it('analyzes a repository successfully when the token is valid', async () => {
    const validToken = jwt.sign(
      { id: 'user-123', name: 'Jane Doe', email: 'jane@example.com' },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    mocks.mockAnalyzeRepository.mockResolvedValue({
      repoUrl: 'https://github.com/vercel/next.js',
      repoName: 'vercel/next.js',
      maturityScore: 88,
      level: 'Production',
      isProductionReady: true,
      projectContext: { intent: 'production-saas', confidence: 90, signals: [], expectedFeatures: [], notRequiredFeatures: [] },
      categoryScores: {},
      dangerousIssues: [],
      missingImprovements: [],
      strengths: ['Strong project'],
      criticalBlockers: [],
      nextSteps: ['Improve docs'],
      analyzedAt: new Date(),
      aiInsights: null,
      techStack: ['Next.js'],
      fileTreeStructure: [],
      selectedFilesCount: 1,
    });

    mocks.mockReportFindOneAndUpdate.mockResolvedValue({
      _id: 'report-123',
      isNew: false,
    });

    mocks.mockChatFindOneAndUpdate.mockResolvedValue({
      _id: 'chat-123',
      isNew: false,
    });

    const response = await analyseHandler(
      new Request('http://localhost/api/analyse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': validToken,
        },
        body: JSON.stringify({ repoUrl: 'https://github.com/vercel/next.js' }),
      })
    );

    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.reportId).toBe('report-123');
    expect(payload.chatId).toBe('chat-123');
    expect(mocks.mockAnalyzeRepository).toHaveBeenCalledWith('https://github.com/vercel/next.js');
  });
});
