import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';

// Form validation schema
const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' })
    .refine((email) => {
      // Simple check for educational email domains - can be expanded
      const eduDomains = ['edu', 'ac.uk', 'ac.in', 'edu.au'];
      return eduDomains.some(domain => email.endsWith(domain)) || true; // Skipping for demo
    }, { message: 'Please use your college email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setAuthError(null);
      await signup(data.name, data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      setAuthError('Signup failed. Please try again.');
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
          <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
            Create Your Account
          </h2>
          <p className="mb-6 text-gray-600">
            Join the campus marketplace to buy, sell, and connect with other students.
          </p>
        </div>

        {authError && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{authError}</div>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              className={`mt-0 block w-full rounded-md bg-white text-gray-900 font-semibold shadow-sm border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:border-orange-700 focus:ring-orange-700 hover:border-orange-500 transition-all duration-200 sm:text-base px-4 py-3 placeholder-gray-400`}
              placeholder="Full Name"
              {...register('name')}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              College Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              className={`mt-0 block w-full rounded-md bg-white text-gray-900 font-semibold shadow-sm border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:border-orange-700 focus:ring-orange-700 hover:border-orange-500 transition-all duration-200 sm:text-base px-4 py-3 placeholder-gray-400`}
              placeholder="College Email"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              className={`mt-0 block w-full rounded-md bg-white text-gray-900 font-semibold shadow-sm border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:border-orange-700 focus:ring-orange-700 hover:border-orange-500 transition-all duration-200 sm:text-base px-4 py-3 placeholder-gray-400`}
              placeholder="Password"
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className={`mt-0 block w-full rounded-md bg-white text-gray-900 font-semibold shadow-sm border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:border-orange-700 focus:ring-orange-700 hover:border-orange-500 transition-all duration-200 sm:text-base px-4 py-3 placeholder-gray-400`}
              placeholder="Confirm Password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center group">
            <input
              id="terms"
              type="checkbox"
              className={`h-4 w-4 rounded border-gray-300 text-blue-700 focus:ring-blue-700 transition-all duration-200 ease-in-out group-hover:border-blue-600 group-hover:bg-blue-100 ${errors.terms ? 'border-red-500' : ''}`}
              {...register('terms', { required: true })}
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900 select-none cursor-pointer transition-colors duration-200">
              I agree to the{' '}
              <Link to="#" className="font-medium text-orange-700 hover:text-orange-800">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="#" className="font-medium text-orange-700 hover:text-orange-800">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.terms && (
            <p className="mt-1 text-xs text-red-600">{errors.terms.message}</p>
          )}

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full text-lg font-bold rounded-2xl py-3 mt-6"
              isLoading={isLoading}
            >
              Sign Up
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary text-orange-700 hover:underline hover:text-orange-900 transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;