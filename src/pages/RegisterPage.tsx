import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Mail,
  Lock,
  User as UserIcon,
  Building2,
  UserCheck,
  AtSign,
  MapPin,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';
import { POPULAR_DELHI_LOCALITIES } from '../constants/locations';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-z0-9_]+$/, 'Username must be lowercase letters, numbers, or underscore'),
  email: z.string().email('Please enter a valid email address'),
  city: z.string().min(1, 'City is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['USER', 'BUSINESS_OWNER']),
  bio: z.string().max(500).optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, authError, setAuthError } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'USER' | 'BUSINESS_OWNER'>('USER');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      city: 'Delhi',
      password: '',
      role: 'USER',
      bio: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setAuthError(null);
      await registerUser(values);
      setRegisterSuccess(true);
      setTimeout(() => {
        navigate(ROUTES.PROFILE);
      }, 500);
    } catch (err: any) {
      // Error handled in useAuth
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Create SpotPicks Account
        </h2>
        <p className="text-xs text-slate-500">
          Join thousands of local explorers and verified businesses in Delhi
        </p>
      </div>

      {/* Success Notification */}
      {registerSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Account created! Redirecting to your profile...</span>
        </div>
      )}

      {/* Error Notification */}
      {authError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{authError}</span>
        </div>
      )}

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
        <button
          type="button"
          onClick={() => {
            setSelectedRole('USER');
            setValue('role', 'USER');
          }}
          className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            selectedRole === 'USER'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserIcon className="h-3.5 w-3.5" /> Local Explorer
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedRole('BUSINESS_OWNER');
            setValue('role', 'BUSINESS_OWNER');
          }}
          className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            selectedRole === 'BUSINESS_OWNER'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="h-3.5 w-3.5" /> Business Owner
        </button>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Full Name"
            placeholder="e.g. Rahul Sharma"
            leftIcon={<UserIcon className="h-4 w-4" />}
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Username"
            placeholder="rahul_delhi"
            leftIcon={<AtSign className="h-4 w-4" />}
            error={errors.username?.message}
            {...register('username')}
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="rahul@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="City / Region"
            placeholder="Delhi"
            leftIcon={<MapPin className="h-4 w-4" />}
            error={errors.city?.message}
            {...register('city')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Min 6 characters"
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <input type="hidden" value={selectedRole} {...register('role')} />

        <Button
          type="submit"
          className="w-full shadow-md"
          isLoading={isLoading}
          rightIcon={<UserCheck className="h-4 w-4" />}
        >
          Create {selectedRole === 'BUSINESS_OWNER' ? 'Business Owner' : 'Explorer'} Account
        </Button>
      </form>

      <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="font-bold text-indigo-600 hover:text-indigo-700">
          Sign In
        </Link>
      </div>
    </div>
  );
};
