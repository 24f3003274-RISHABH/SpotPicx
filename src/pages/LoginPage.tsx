import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, LogIn, AlertCircle, CheckCircle2, UserCheck, ShieldCheck, Briefcase } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

const loginSchema = z.object({
  email: z.string().min(1, 'Email or username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || ROUTES.PROFILE;

  const { login, isLoading, authError, setAuthError } = useAuth();
  const [loginSuccess, setLoginSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setAuthError(null);
      await login(values);
      setLoginSuccess(true);
      setTimeout(() => {
        navigate(redirectPath);
      }, 500);
    } catch (err: any) {
      // Error handled by useAuth
    }
  };

  // Quick fill for testing different user roles in Phase 2
  const fillDemoAccount = (role: 'admin' | 'owner' | 'user') => {
    if (role === 'admin') {
      setValue('email', 'admin@spotpicks.com');
      setValue('password', 'admin123');
    } else if (role === 'owner') {
      setValue('email', 'owner@spotpicks.com');
      setValue('password', 'owner123');
    } else {
      setValue('email', 'user@spotpicks.com');
      setValue('password', 'user123');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Sign In to SpotPicks
        </h2>
        <p className="text-xs text-slate-500">
          Enter your registered email or username to access your account
        </p>
      </div>

      {/* Success Notification */}
      {loginSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Login successful! Redirecting to your dashboard...</span>
        </div>
      )}

      {/* Error Notification */}
      {authError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{authError}</span>
        </div>
      )}

      {/* Main Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email or Username"
          type="text"
          placeholder="admin@spotpicks.com or username"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
            />
            <span>Stay signed in (7 days)</span>
          </label>
          <span className="text-slate-400 hover:text-indigo-600 cursor-pointer">
            Forgot password?
          </span>
        </div>

        <Button
          type="submit"
          className="w-full shadow-md"
          isLoading={isLoading}
          rightIcon={<LogIn className="h-4 w-4" />}
        >
          Sign In
        </Button>
      </form>

      {/* Quick Test Demo Accounts Helper */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Quick Test Accounts:
          </span>
          <Badge variant="indigo" size="sm">Phase 2 Ready</Badge>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => fillDemoAccount('admin')}
            className="text-[11px] py-1.5 px-2 bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 rounded-lg font-medium text-slate-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <ShieldCheck className="h-3 w-3 text-indigo-600" /> Admin
          </button>
          <button
            type="button"
            onClick={() => fillDemoAccount('owner')}
            className="text-[11px] py-1.5 px-2 bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 rounded-lg font-medium text-slate-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <Briefcase className="h-3 w-3 text-emerald-600" /> Owner
          </button>
          <button
            type="button"
            onClick={() => fillDemoAccount('user')}
            className="text-[11px] py-1.5 px-2 bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 rounded-lg font-medium text-slate-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <UserCheck className="h-3 w-3 text-slate-600" /> User
          </button>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-500">
        Don't have an account?{' '}
        <Link to={ROUTES.REGISTER} className="font-bold text-indigo-600 hover:text-indigo-700">
          Create one for free
        </Link>
      </div>
    </div>
  );
};
