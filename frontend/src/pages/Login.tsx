import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { Card, Input, Button } from '../components/ui';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Login failed. Please try again.');
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
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
              Register here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

