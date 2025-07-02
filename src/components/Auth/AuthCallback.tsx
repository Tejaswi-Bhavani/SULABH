import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { CheckCircle, AlertCircle } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Parse hash parameters
        const hash = window.location.hash.substring(1); // Remove '#'
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        const errorParam = params.get('error');
        const errorDescription = params.get('error_description');
        const type = params.get('type');

        if (errorParam) {
          throw new Error(`${errorParam}: ${errorDescription}`);
        }

        if (type === 'signup' || type === 'email_confirmation') {
          // Set session manually using access token
          if (accessToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: params.get('refresh_token') || '',
            });
            if (error) throw error;

            console.log('Session established');
            setTimeout(() => {
              navigate('/login', {
                state: { message: 'Email verified successfully! You can now log in.' },
              });
            }, 2000);
          } else {
            throw new Error('No access token provided');
          }
        } else if (type === 'recovery') {
          navigate('/reset-password');
        } else {
          throw new Error('Invalid callback type');
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'An error occurred during authentication');
      } finally {
        setVerifying(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying your account</h2>
          <p className="text-gray-600">Please wait while we verify your account...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-error-100">
            <AlertCircle className="w-6 h-6 text-error-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verification Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={() => navigate('/login')} className="btn-primary">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-success-100">
          <CheckCircle className="w-6 h-6 text-success-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Verification Successful</h2>
        <p className="text-gray-600 mb-6">Your email has been verified. Redirecting to login...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
