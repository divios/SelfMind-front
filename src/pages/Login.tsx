import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ThemeToggle } from '@/components/theme-toggle';
import { login } from '@/lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { token } = await login(email, password);
      authLogin(token);
      navigate('/');
      toast({
        title: 'Success',
        description: 'You have been logged in successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to login. Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-[450px]">
        <CardHeader className="space-y-3">
          <CardTitle className="text-3xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-lg text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-lg">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-12 text-lg"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="password" className="text-lg">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="h-12 text-lg"
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            <div className="text-center text-base">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Register
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 