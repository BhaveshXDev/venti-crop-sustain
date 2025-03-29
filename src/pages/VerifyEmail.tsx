import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Check, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');

      if (!token || type !== 'email') {
        setVerificationStatus('error');
        setErrorMessage('Invalid verification link');
        toast.error('Invalid verification link');
        return;
      }

      try {
        const { data: { user: verifiedUser }, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'email',
        });

        if (error) throw error;

        if (verifiedUser) {
          setVerificationStatus('success');
          toast.success('Email verified successfully');
          
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        }
      } catch (error: any) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
        setErrorMessage(error.message || 'Failed to verify email');
        toast.error(error.message || 'Failed to verify email');
      }
    };

    verifyEmail();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-b from-white to-venti-green-50 dark:from-venti-gray-900 dark:to-venti-green-950">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <img
              src="/lovable-uploads/fa9ac5dd-b695-4d56-803b-1836e56645fb.png"
              alt="VentiGrow Logo"
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className="venti-logo-text text-2xl font-semibold mb-1">
            Email Verification
          </h1>
        </div>

        <div className="venti-glass dark:venti-glass-dark rounded-2xl p-8 shadow-sm mb-4 text-center">
          {verificationStatus === 'loading' && (
            <div className="flex flex-col items-center justify-center py-6">
              <Loader2 size={40} className="animate-spin text-venti-green-600 dark:text-venti-green-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Verifying Your Email</h3>
              <p className="text-venti-gray-600 dark:text-venti-gray-400">
                Please wait while we verify your email address...
              </p>
            </div>
          )}

          {verificationStatus === 'success' && (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="w-16 h-16 bg-venti-green-100 dark:bg-venti-green-900/30 rounded-full flex items-center justify-center mb-4">
                <Check size={32} className="text-venti-green-600 dark:text-venti-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Verified</h3>
              <p className="text-venti-gray-600 dark:text-venti-gray-400">
                Your email has been successfully verified. Redirecting you to dashboard...
              </p>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={32} className="text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verification Failed</h3>
              <p className="text-rose-600 dark:text-rose-400 mb-4">
                {errorMessage || 'Failed to verify your email address'}
              </p>
              <button
                onClick={() => navigate('/login')}
                className="venti-button-primary"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
