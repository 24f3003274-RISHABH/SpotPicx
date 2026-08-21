import React, { useEffect, useState } from 'react';
import {
  Users,
  Shield,
  ShieldCheck,
  Search,
  Loader2,
  UserCheck,
  UserX,
  Mail,
} from 'lucide-react';
import { apiClient } from '../../api/apiClient';

interface UserRecord {
  _id: string;
  name: string;
  email: string;
  role: 'USER' | 'BUSINESS_OWNER' | 'ADMIN' | 'SUPER_ADMIN';
  isEmailVerified: boolean;
  createdAt: string;
}

export const AdminUsersTab: React.FC = () => {
  const [users, setUsers] = useState<UserRecord[]>([
    {
      _id: 'usr-admin-1',
      name: 'System Superadmin',
      email: 'admin@spotpicks.in',
      role: 'SUPER_ADMIN',
      isEmailVerified: true,
      createdAt: '2025-01-01',
    },
    {
      _id: 'usr-owner-1',
      name: 'Raghav Mehra (Blue Tokai)',
      email: 'raghav@bluetokai.in',
      role: 'BUSINESS_OWNER',
      isEmailVerified: true,
      createdAt: '2025-02-10',
    },
    {
      _id: 'usr-2',
      name: 'Ananya Verma',
      email: 'ananya@example.com',
      role: 'USER',
      isEmailVerified: true,
      createdAt: '2025-03-01',
    },
    {
      _id: 'usr-3',
      name: 'Kabir Singhania',
      email: 'kabir@example.com',
      role: 'USER',
      isEmailVerified: true,
      createdAt: '2025-03-12',
    },
  ]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = (userId: string, newRole: any) => {
    setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-rose-600" />
            <span>User Accounts & RBAC Roles ({users.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Audit registered explorers, business proprietors, and administrative permissions.
          </p>
        </div>

        <div className="relative">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">User Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Verification</th>
                <th className="p-4">Assigned Role</th>
                <th className="p-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">{u.name}</span>
                  </td>
                  <td className="p-4 text-slate-500">{u.email}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <UserCheck className="h-3 w-3" />
                      <span>Verified</span>
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="text-xs font-bold px-2 py-1 rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="USER">USER</option>
                      <option value="BUSINESS_OWNER">BUSINESS_OWNER</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    </select>
                  </td>
                  <td className="p-4 text-slate-400">{u.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
