import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { registerSchema } from '@shared/schemas/auth';
import type { RegisterData } from '../types';

interface RegisterFormState {
  email: string;
  username: string;
  password: string;
  name: string;
}

interface FieldErrors {
  email?: string[];
  username?: string[];
  password?: string[];
  name?: string[];
}

export const Register = () => {
  const [formData, setFormData] = useState<RegisterFormState>({
    email: '',
    username: '',
    password: '',
    name: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string>('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name as keyof RegisterFormState;
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    setServerError('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setServerError('');

    const payload: RegisterData = {
      email: formData.email,
      username: formData.username,
      password: formData.password,
      ...(formData.name.trim() ? { name: formData.name } : {}),
    };

    const validationResult = registerSchema.safeParse(payload);
    
    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      setFieldErrors(errors as FieldErrors);
      return;
    }

    try {
      await register(payload);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
        toast.error(error.message);
      } else {
        setServerError('Registration failed. Please try again.');
        toast.error('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl">
            <span className="font-bold text-slate-900">Taski</span>
            <span className="text-indigo-600">.ai</span>
          </h1>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-slate-900">Register</h2>
        {serverError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {serverError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
            {fieldErrors.email && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.email[0]}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
            {fieldErrors.username && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.username[0]}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name (Optional)</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            {fieldErrors.name && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.name[0]}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
            {fieldErrors.password && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.password[0]}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-600 underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
