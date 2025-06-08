import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn, Send } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  rememberMe: z.boolean().optional(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type ForgotFormValues = z.infer<typeof forgotPasswordSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, resetPassword } = useAuth(); // ensure resetPassword is defined
  const [authError, setAuthError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const {
    register: registerForgot,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      setAuthError(null);
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (error) {
      setAuthError('Login failed. Please check your credentials.');
    }
  };

  const onForgotSubmit = async (data: ForgotFormValues) => {
    try {
      await resetPassword(data.email);
      setResetSent(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-8">
        {window.history.length > 1 && (
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#ef6c13] to-[#f3701a] text-white font-bold shadow hover:from-[#e65c00] hover:to-[#f3701a]"
          >
            &#8592; Back
          </button>
        )}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="#D35400" />
              <text x="50%" y="56%" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold" fontFamily="Arial, sans-serif" dy=".3em">
                CC
              </text>
            </svg>
          </div>
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            {showForgotPassword ? 'Reset Password' : 'Welcome Back'}
          </h2>
          <p className="mb-6 text-gray-600">
            {showForgotPassword
              ? 'Enter your email and we will send you a password reset link.'
              : 'Sign in to access your account and continue buying and selling on campus.'}
          </p>
        </div>

        {authError && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{authError}</div>
          </div>
        )}

        {showForgotPassword ? (
          resetSent ? (
            <p className="text-green-600 text-center mb-4">
              ✅ If your email exists, a password reset link has been sent.
            </p>
          ) : (
            <form onSubmit={handleForgotSubmit(onForgotSubmit)} className="space-y-6">
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="you@example.com"
                  className={`block w-full rounded-md bg-white text-gray-900 font-semibold shadow-sm border ${
                    forgotErrors.email ? 'border-red-500' : 'border-gray-300'
                  } focus:border-orange-700 focus:ring-orange-700 px-4 py-3`}
                  {...registerForgot('email')}
                />
                {forgotErrors.email && (
                  <p className="mt-1 text-xs text-red-600">{forgotErrors.email.message}</p>
                )}
              </div>
              <Button type="submit" variant="primary" className="w-full">
                <Send className="w-5 h-5 mr-2" />
                Send Reset Link
              </Button>
              <div className="text-sm text-center">
                <button type="button" onClick={() => setShowForgotPassword(false)} className="text-orange-700 hover:underline">
                  ← Back to Login
                </button>
              </div>
            </form>
          )
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit(onLoginSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                className={`mt-0 block w-full rounded-md bg-white text-gray-900 font-semibold shadow-sm border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } focus:border-orange-700 focus:ring-orange-700 px-4 py-3 placeholder-gray-400`}
                placeholder="Email Address"
                {...register('email')}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm font-medium text-orange-700 hover:text-orange-800"
                >
                  Forgot your password?
                </button>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                className={`mt-0 block w-full rounded-md bg-white text-gray-900 font-semibold shadow-sm border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } focus:border-orange-700 focus:ring-orange-700 px-4 py-3 placeholder-gray-400`}
                placeholder="Password"
                {...register('password')}
              />
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-orange-700 focus:ring-orange-700"
                {...register('rememberMe')}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <Button type="submit" variant="primary" className="w-full text-lg font-bold rounded-2xl py-3 mt-6" isLoading={isLoading}>
              <LogIn className="mr-2 h-5 w-5" />
              Login
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
