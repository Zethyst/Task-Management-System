import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CheckSquare } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export default function Auth() {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If authenticated, don't render the auth form (redirect will happen via useEffect)
  if (isAuthenticated) {
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = loginSchema.safeParse(loginForm);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((err: any) => {
        if (err.path[0]) {
          formattedErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    setIsLoading(true);
    const { success, error } = await login(loginForm.email, loginForm.password);
    setIsLoading(false);

    if (success) {
      toast.success('Successfully logged in.');
      navigate('/');
    } else {
      toast.error(error || 'Login failed');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse(registerForm);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((err: any) => {
        if (err.path[0]) {
          formattedErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    setIsLoading(true);
    const { success, error } = await register(
      registerForm.email,
      registerForm.password,
      registerForm.name
    );
    setIsLoading(false);

    if (success) {
      toast.success('Account created!');
      navigate('/');
    } else {
      toast.error(error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-emerald-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-green-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-1/4 left-1/3 w-80 h-80 bg-teal-400/25 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <Card className="w-full max-w-md relative z-10 border-emerald-200/50 shadow-2xl shadow-emerald-500/20 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="flex items-center justify-center gap-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/50 transform hover:scale-105 transition-transform duration-300">
              <CheckSquare className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              TaskFlow
            </CardTitle>
            <CardDescription className="text-emerald-600/70 mt-2">
              Collaborative task management for teams
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-emerald-100/50 p-1">
              <TabsTrigger 
                value="login" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="register"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
              >
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-emerald-700 font-medium">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginForm.email}
                    onChange={e => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-300"
                  />
                  {errors.email && <p className="text-sm text-red-500 flex items-center gap-1"><span>⚠</span>{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-emerald-700 font-medium">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={e => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-300"
                  />
                  {errors.password && <p className="text-sm text-red-500 flex items-center gap-1"><span>⚠</span>{errors.password}</p>}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-emerald-500/50 transition-all duration-300 transform hover:scale-[1.02] mt-6" 
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4 mt-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="text-emerald-700 font-medium">Name</Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="John Doe"
                    value={registerForm.name}
                    onChange={e => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                    className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-300"
                  />
                  {errors.name && <p className="text-sm text-red-500 flex items-center gap-1"><span>⚠</span>{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-emerald-700 font-medium">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="you@example.com"
                    value={registerForm.email}
                    onChange={e => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                    className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-300"
                  />
                  {errors.email && <p className="text-sm text-red-500 flex items-center gap-1"><span>⚠</span>{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-emerald-700 font-medium">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerForm.password}
                    onChange={e => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                    className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-300"
                  />
                  {errors.password && <p className="text-sm text-red-500 flex items-center gap-1"><span>⚠</span>{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirm" className="text-emerald-700 font-medium">Confirm Password</Label>
                  <Input
                    id="register-confirm"
                    type="password"
                    placeholder="••••••••"
                    value={registerForm.confirmPassword}
                    onChange={e => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-300"
                  />
                  {errors.confirmPassword && <p className="text-sm text-red-500 flex items-center gap-1"><span>⚠</span>{errors.confirmPassword}</p>}
                </div>

                <Button 
                  type="submit" 
                  className="cursor-pointer w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-emerald-500/50 transition-all duration-300 transform hover:scale-[1.02] mt-6" 
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
