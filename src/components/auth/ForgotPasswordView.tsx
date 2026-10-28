import React, { useState } from 'react';
import { 
  Shield, 
  Mail, 
  ArrowLeft, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Sun, 
  Moon,
  KeyRound,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { AICTE_SEAL_IMG } from '../../data/mockData';

interface ForgotPasswordViewProps {
  onNavigate: (view: 'login' | 'signup' | 'forgot-password' | 'reset-password') => void;
  onSetResetToken?: (token: string) => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({
  onNavigate,
  onSetResetToken,
}) => {
  const { forgotPassword } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ message: string; resetToken?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessInfo(null);

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Please provide a valid registered official email address.');
      return;
    }

    setIsLoading(true);
    const result = await forgotPassword(email.trim());
    setIsLoading(false);

    if (result.success) {
      setSuccessInfo({
        message: result.message || 'Password reset token generated successfully.',
        resetToken: result.resetToken,
      });
      if (result.resetToken && onSetResetToken) {
        onSetResetToken(result.resetToken);
      }
    } else {
      setErrorMessage(result.error || 'Unable to initiate password reset for this email.');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 py-8 bg-slate-50 dark:bg-[#080d1a] text-slate-900 dark:text-slate-100 transition-colors duration-200 selection:bg-cyan-500/30 selection:text-cyan-800 dark:selection:text-cyan-200 relative">
      {/* Top Bar with Theme Switcher */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-3">
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium"
        >
          {theme === 'dark' ? (
            <>
              <Sun size={15} className="text-amber-400" />
              <span className="hidden sm:inline">Light Mode</span>
            </>
          ) : (
            <>
              <Moon size={15} className="text-indigo-600" />
              <span className="hidden sm:inline">Dark Mode</span>
            </>
          )}
        </button>
      </div>

      <div className="w-full max-w-md my-auto">
        {/* Brand & Seal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md mb-3 p-1.5 relative overflow-hidden">
            <img 
              src={AICTE_SEAL_IMG} 
              alt="AICTE VerifyAI" 
              className="w-full h-full object-cover rounded-xl"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-cyan-900/20 dark:bg-cyan-950/40 pointer-events-none rounded-xl">
              <Shield className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Forgot Password
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Recover access to your AICTE VerifyAI statutory auditor or institution account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#0d162f] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 backdrop-blur-md">
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in">
              <AlertCircle size={16} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {successInfo ? (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-900 dark:text-emerald-300">
                  <CheckCircle2 size={16} />
                  <span>Reset Authorization Issued</span>
                </div>
                <p className="leading-relaxed">
                  A cryptographic reset token has been verified and registered for <strong>{email}</strong>.
                </p>
                {successInfo.resetToken && (
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-emerald-200 dark:border-emerald-900/50 font-mono text-[11px] break-all text-slate-800 dark:text-slate-300">
                    <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold mb-0.5">Authorization Token:</span>
                    {successInfo.resetToken}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => onNavigate('reset-password')}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl text-xs shadow-md shadow-blue-900/20 dark:shadow-blue-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Proceed to Set New Password</span>
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="w-full py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-center block"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Registered Official Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. officer@aicte-india.org"
                    required
                    autoComplete="email"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  We will verify the statutory roll and generate a secure password reset token.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl text-xs shadow-md shadow-blue-900/20 dark:shadow-blue-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 active:scale-[0.99]"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                <span>{isLoading ? 'Verifying Account...' : 'Generate Reset Token'}</span>
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>Back to Sign In</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
