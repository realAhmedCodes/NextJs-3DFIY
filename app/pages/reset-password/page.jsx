// pages/reset-password.js
"use client";
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Toast } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();
  
  const handlePasswordReset = async () => {
    if (!newPassword || !confirmPassword) {
      toast('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast('Passwords do not match');
      return;
    }

    setIsLoading(true);
    toast('');
    toast('');

    try {
      const { email } = router.query; // Assuming the email is passed via query params after OTP verification

      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast(data.message);
        // Redirect to login page or another page after success
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        toast(data.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error(error);
      toast('An error occurred while resetting the password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Reset Password</h2>
        <div className="mb-4">
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter New Password"
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <Button
            variant="primary"
            onClick={handlePasswordReset}
            isLoading={isLoading}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
