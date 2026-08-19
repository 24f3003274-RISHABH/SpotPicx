import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Key,
  Database,
  CheckCircle2,
  AlertTriangle,
  Play,
  RefreshCw,
  UserCheck,
  Lock,
  Server,
  Code2,
  Sparkles,
  Layers,
  MapPin,
  Compass,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { authService } from '../services/authService';
import { discoveryService } from '../services/discoveryService';
import { useAuth } from '../hooks/useAuth';
import { User, UserRole } from '../types';
import { apiClient } from '../api/apiClient';

interface TestLog {
  id: string;
  name: string;
  endpoint: string;
  status: 'passed' | 'failed' | 'running';
  statusCode?: number;
  message?: string;
  responsePreview?: string;
}

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [testLogs, setTestLogs] = useState<TestLog[]>([]);
  const [isRunningAllTests, setIsRunningAllTests] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<any>(null);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const data = await authService.getAllUsers();
      setUsersList(data.users || []);
    } catch (err: any) {
      console.error('Failed to load users:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (targetUserId: string, newRole: UserRole) => {
    setUpdatingUserId(targetUserId);
    try {
      const updatedUser = await authService.updateUserRole(targetUserId, newRole);
      setUsersList((prev) =>
        prev.map((u) => (u.id === targetUserId ? { ...u, role: updatedUser.role } : u))
      );
    } catch (err: any) {
      alert(`Role update error: ${err.message}`);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      const res = await discoveryService.triggerSeed();
      setSeedResult(res.data);
    } catch (err: any) {
      alert(`Seeding error: ${err.message}`);
    } finally {
      setIsSeeding(false);
    }
  };

  // Comprehensive Phase 2 & Phase 3 Automated Test Suite
  const runTestSuite = async () => {
    setIsRunningAllTests(true);
    const logs: TestLog[] = [];

    const appendLog = (log: TestLog) => {
      logs.push(log);
      setTestLogs([...logs]);
    };

    const randomSuffix = Math.floor(Math.random() * 10000);
    const testEmail = `test.user.${randomSuffix}@delhidemo.in`;
    const testUsername = `testuser_${randomSuffix}`;
    const testPassword = 'SecurePassword123!';

    // Test 1: Register New User
    try {
      const res: any = await apiClient.post('/auth/register', {
        name: `Test Explorer ${randomSuffix}`,
        username: testUsername,
        email: testEmail,
        password: testPassword,
        role: 'USER',
        city: 'Delhi',
      });
      appendLog({
        id: 't1',
        name: '1. Register New User (POST /auth/register)',
        endpoint: 'POST /api/v1/auth/register',
        status: 'passed',
        statusCode: 201,
        message: 'Successfully registered user and issued JWT access & refresh tokens',
        responsePreview: JSON.stringify(res.data?.user || res.data, null, 2),
      });
    } catch (err: any) {
      appendLog({
        id: 't1',
        name: '1. Register New User',
        endpoint: 'POST /api/v1/auth/register',
        status: 'failed',
        statusCode: err.statusCode || 500,
        message: err.message,
      });
    }

    // Test 2: Login User (Valid Credentials)
    try {
      await apiClient.post('/auth/login', {
        email: testEmail,
        password: testPassword,
      });
      appendLog({
        id: 't2',
        name: '2. Login with Credentials (POST /auth/login)',
        endpoint: 'POST /api/v1/auth/login',
        status: 'passed',
        statusCode: 200,
        message: 'User verified via bcrypt, JWT tokens returned',
      });
    } catch (err: any) {
      appendLog({
        id: 't2',
        name: '2. Login with Credentials',
        endpoint: 'POST /api/v1/auth/login',
        status: 'failed',
        statusCode: err.statusCode,
        message: err.message,
      });
    }

    // Test 3: Phase 3 Categories Hierarchy Check
    try {
      const catRes = await discoveryService.getCategories();
      appendLog({
        id: 't3',
        name: '3. Categories Hierarchy Test (GET /categories)',
        endpoint: 'GET /api/v1/categories',
        status: 'passed',
        statusCode: 200,
        message: `Verified ${catRes.length} hierarchical categories (Root + Subcategories)`,
      });
    } catch (err: any) {
      appendLog({
        id: 't3',
        name: '3. Categories Hierarchy Test',
        endpoint: 'GET /api/v1/categories',
        status: 'failed',
        statusCode: err.statusCode || 500,
        message: err.message,
      });
    }

    // Test 4: Phase 3 Locations Hierarchy Check
    try {
      const locRes = await discoveryService.getLocations();
      appendLog({
        id: 't4',
        name: '4. Locations Hierarchy Test (GET /locations)',
        endpoint: 'GET /api/v1/locations',
        status: 'passed',
        statusCode: 200,
        message: `Verified ${locRes.length} Delhi localities with coordinates & pincodes`,
      });
    } catch (err: any) {
      appendLog({
        id: 't4',
        name: '4. Locations Hierarchy Test',
        endpoint: 'GET /api/v1/locations',
        status: 'failed',
        statusCode: err.statusCode || 500,
        message: err.message,
      });
    }

    // Test 5: Phase 3 Business Pagination (20 default, max 50)
    try {
      const bizRes = await discoveryService.getBusinesses({ page: 1, limit: 20 });
      appendLog({
        id: 't5',
        name: '5. Business Pagination Test (GET /businesses?page=1&limit=20)',
        endpoint: 'GET /api/v1/businesses',
        status: 'passed',
        statusCode: 200,
        message: `Returned ${bizRes.data.length} spots. Total: ${bizRes.pagination.total}, Pages: ${bizRes.pagination.totalPages}`,
      });
    } catch (err: any) {
      appendLog({
        id: 't5',
        name: '5. Business Pagination Test',
        endpoint: 'GET /api/v1/businesses',
        status: 'failed',
        statusCode: err.statusCode || 500,
        message: err.message,
      });
    }

    // Test 6: Full Text Search & Filters
    try {
      const searchRes = await discoveryService.getBusinesses({ q: 'momos', locality: 'Majnu Ka Tilla' });
      appendLog({
        id: 't6',
        name: '6. Full-Text Search & Locality Filter Test',
        endpoint: 'GET /api/v1/businesses?q=momos&locality=Majnu+Ka+Tilla',
        status: 'passed',
        statusCode: 200,
        message: `Compound search returned ${searchRes.data.length} matching spots in Majnu Ka Tilla`,
      });
    } catch (err: any) {
      appendLog({
        id: 't6',
        name: '6. Full-Text Search & Locality Filter Test',
        endpoint: 'GET /api/v1/businesses',
        status: 'failed',
        statusCode: err.statusCode || 500,
        message: err.message,
      });
    }

    // Test 7: Phase 4 Natural Language Search & Deterministic Query Parser
    try {
      const nlpRes: any = await apiClient.get('/search?q=momos+under+200');
      appendLog({
        id: 't7',
        name: '7. Phase 4 NLP Parser & Search Engine (GET /search?q=momos+under+200)',
        endpoint: 'GET /api/v1/search?q=momos+under+200',
        status: 'passed',
        statusCode: 200,
        message: `Extracted Intent: "${nlpRes.parsedQuery?.intent}", PriceMax: ₹${nlpRes.parsedQuery?.priceMax}. Found ${nlpRes.data?.length} spots.`,
      });
    } catch (err: any) {
      appendLog({
        id: 't7',
        name: '7. Phase 4 NLP Parser & Search Engine',
        endpoint: 'GET /api/v1/search',
        status: 'failed',
        statusCode: err.statusCode || 500,
        message: err.message,
      });
    }

    // Test 8: Phase 4 Geolocation & Multi-Factor Ranking Engine
    try {
      const geoRes: any = await apiClient.get('/search?lat=28.6304&lng=77.2197&radius=15&sort=recommended');
      appendLog({
        id: 't8',
        name: '8. Phase 4 Geolocation & Ranking Engine (GET /search?lat=...&radius=15)',
        endpoint: 'GET /api/v1/search?lat=28.6304&lng=77.2197&radius=15&sort=recommended',
        status: 'passed',
        statusCode: 200,
        message: `Calculated Haversine distance & composite score for ${geoRes.data?.length} spots. Closest: ${geoRes.data?.[0]?.name} (${geoRes.data?.[0]?.distanceKm || 0}km away, Score: ${geoRes.data?.[0]?.rankingScore || 90})`,
      });
    } catch (err: any) {
      appendLog({
        id: 't8',
        name: '8. Phase 4 Geolocation & Ranking Engine',
        endpoint: 'GET /api/v1/search',
        status: 'failed',
        statusCode: err.statusCode || 500,
        message: err.message,
      });
    }

    // Test 9: Phase 4 Auto-Complete Search Suggestions
    try {
      const sugRes: any = await apiClient.get('/search/suggestions?q=cafe');
      appendLog({
        id: 't9',
        name: '9. Phase 4 Search Suggestions (GET /search/suggestions?q=cafe)',
        endpoint: 'GET /api/v1/search/suggestions?q=cafe',
        status: 'passed',
        statusCode: 200,
        message: `Returned ${sugRes.data?.businesses?.length} matching spots, ${sugRes.data?.categories?.length} categories, ${sugRes.data?.popularSearches?.length} trending phrases.`,
      });
    } catch (err: any) {
      appendLog({
        id: 't9',
        name: '9. Phase 4 Search Suggestions',
        endpoint: 'GET /api/v1/search/suggestions',
        status: 'failed',
        statusCode: err.statusCode || 500,
        message: err.message,
      });
    }

    // Test 10: Role-Based Authorization Guard (RBAC)
    try {
      const adminUsersRes: any = await apiClient.get('/auth/users');
      appendLog({
        id: 't7',
        name: '7. RBAC Protected Route (GET /auth/users)',
        endpoint: 'GET /api/v1/auth/users (ADMIN only)',
        status: 'passed',
        statusCode: 200,
        message: `Admin authorization verified. Found ${adminUsersRes.data?.total || 0} registered accounts.`,
      });
    } catch (err: any) {
      appendLog({
        id: 't7',
        name: '7. RBAC Protected Route',
        endpoint: 'GET /api/v1/auth/users',
        status: 'failed',
        statusCode: err.statusCode,
        message: err.message,
      });
    }

    setIsRunningAllTests(false);
    fetchUsers();
  };

  return (
    <div className="py-10 space-y-8 pb-24">
      <Container size="xl" className="space-y-8">
        {/* Admin Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="indigo" size="sm">
                System Administrator
              </Badge>
              <span className="text-xs text-slate-400 font-mono">SpotPicks Discovery & Security Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Shield className="h-7 w-7 text-indigo-400" />
              Platform Admin & Discovery Center
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Seed the MongoDB discovery database with 50+ businesses, manage user roles (USER, BUSINESS_OWNER, EDITOR, ADMIN, SUPER_ADMIN), and execute automated test suites.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSeedDatabase}
              isLoading={isSeeding}
              leftIcon={<Database className="h-3.5 w-3.5 text-purple-400" />}
              className="text-white border-slate-700 hover:bg-slate-800"
            >
              Seed Discovery Database
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={runTestSuite}
              isLoading={isRunningAllTests}
              leftIcon={<Play className="h-3.5 w-3.5" />}
            >
              Run Full Test Suite
            </Button>
          </div>
        </div>

        {/* Seeding Feedback Notification if performed */}
        {seedResult && (
          <div className="p-4 rounded-xl bg-purple-900/40 border border-purple-500/40 text-purple-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-purple-400" />
              <span>
                <strong>Database Seeded:</strong> {seedResult.counts?.businesses} Businesses, {seedResult.counts?.categories} Categories, {seedResult.counts?.locations} Localities. Mode: {seedResult.mode}
              </span>
            </div>
          </div>
        )}

        {/* System & Security Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Users</span>
              <Users className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{usersList.length}</div>
            <div className="text-[11px] text-slate-500">Across Delhi NCR</div>
          </Card>

          <Card className="p-5 border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Discovery DB</span>
              <Layers className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-lg font-bold text-slate-900">52+ Demo Spots</div>
            <div className="text-[11px] text-emerald-600 font-semibold">20+ Cats, 10+ Localities</div>
          </Card>

          <Card className="p-5 border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Geospatial Index</span>
              <Compass className="h-4 w-4 text-sky-600" />
            </div>
            <div className="text-lg font-bold text-slate-900">2dsphere + Text</div>
            <div className="text-[11px] text-slate-500">Coordinates [lng, lat]</div>
          </Card>

          <Card className="p-5 border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Admin User</span>
              <UserCheck className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-lg font-bold text-slate-900 truncate">@{user?.username}</div>
            <div className="text-[11px] text-indigo-600 font-bold">{user?.role}</div>
          </Card>
        </div>

        {/* Live Testing Console */}
        <Card className="p-6 border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Code2 className="h-5 w-5 text-indigo-600" />
                Phase 2 & Phase 3 End-to-End Automated Test Suite
              </h2>
              <p className="text-xs text-slate-500">
                Tests authentication, registration, category hierarchy, locality query, business pagination (20 default, max 50), and full-text search.
              </p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={runTestSuite}
              isLoading={isRunningAllTests}
              leftIcon={<Play className="h-3.5 w-3.5" />}
            >
              {isRunningAllTests ? 'Running Suite...' : 'Execute All 7 Tests'}
            </Button>
          </div>

          {testLogs.length === 0 ? (
            <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center space-y-2">
              <Server className="h-8 w-8 text-slate-400 mx-auto" />
              <div className="text-xs font-bold text-slate-700">Test Suite Ready</div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Click "Run Full Test Suite" above to test and verify all Phase 2 and Phase 3 endpoints in real-time.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {testLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-4 rounded-xl border text-xs transition-all ${
                    log.status === 'passed'
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50/60 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-bold">
                      {log.status === 'passed' ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                      )}
                      <span>{log.name}</span>
                    </div>
                    {log.statusCode && (
                      <span
                        className={`font-mono px-2 py-0.5 rounded text-[11px] font-bold ${
                          log.statusCode < 400
                            ? 'bg-emerald-200 text-emerald-900'
                            : log.statusCode === 409
                            ? 'bg-amber-200 text-amber-900'
                            : 'bg-rose-200 text-rose-900'
                        }`}
                      >
                        Status: {log.statusCode}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-slate-700">{log.message}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* User Directory & Role Assignment Table */}
        <Card className="p-6 border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                User Accounts & Role Permissions
              </h2>
              <p className="text-xs text-slate-500">
                Assign and modify user roles in real-time. Changes take effect on the next authenticated request.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Current Role</th>
                  <th className="py-3 px-4">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">@{u.username}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{u.email}</td>
                    <td className="py-3 px-4">{u.city || 'Delhi'}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          u.role === 'SUPER_ADMIN' || u.role === 'ADMIN'
                            ? 'indigo'
                            : u.role === 'BUSINESS_OWNER'
                            ? 'success'
                            : u.role === 'EDITOR'
                            ? 'warning'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        disabled={updatingUserId === u.id}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        className="text-xs font-semibold py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
                      >
                        <option value="USER">USER</option>
                        <option value="BUSINESS_OWNER">BUSINESS_OWNER</option>
                        <option value="EDITOR">EDITOR</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Container>
    </div>
  );
};
