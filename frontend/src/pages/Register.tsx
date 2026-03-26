import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { registerSchema } from '../schemas/auth';
import { Card, Input, Button } from '../components/ui';
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 transition-colors duration-200 px-4">
      <Card className="max-w-md w-full p-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Sparkles className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl">
            <span className="font-bold text-slate-900 dark:text-white">Taski</span>
            <span className="text-indigo-600">.ai</span>
          </h1>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Register</h2>
        {serverError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 rounded-lg text-sm">
            {serverError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Email</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              error={fieldErrors.email?.[0]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Username</label>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="johndoe"
              error={fieldErrors.username?.[0]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Name (Optional)</label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              error={fieldErrors.name?.[0]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Password</label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              error={fieldErrors.password?.[0]}
            />
          </div>
          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
              Login here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};
