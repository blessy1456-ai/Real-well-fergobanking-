import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle,
  ShieldCheck,
  MapPin,
  HelpCircle,
  Smartphone,
  Globe,
  Award,
  CheckCircle2
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [saveUsername, setSaveUsername] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (username.trim() === 'Sofia1234' && password === '12345678') {
        onLoginSuccess();
      } else {
        setErrorMessage('Incorrect username or password. Please verify your credentials.');
      }
    }, 5000);
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f5f8] text-slate-800 flex flex-col font-sans">
      
      {/* Top Utility Bar */}
      <div className="bg-[#1a1a1a] text-slate-300 text-xs border-b border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-9">
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-white font-bold border-b-2 border-[#D71E28] pb-1.5 pt-1 cursor-pointer">
              Personal
            </span>
            <span className="text-slate-400 hover:text-white cursor-pointer transition">
              Small Business
            </span>
            <span className="text-slate-400 hover:text-white cursor-pointer transition hidden sm:inline">
              Commercial
            </span>
            <span className="text-slate-400 hover:text-white cursor-pointer transition hidden md:inline">
              Wealth Management
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-300">
            <div className="flex items-center gap-1 hover:text-white cursor-pointer transition">
              <MapPin className="h-3.5 w-3.5 text-[#FFCD00]" />
              <span className="hidden sm:inline">ATMs/Locations</span>
            </div>
            <div className="flex items-center gap-1 hover:text-white cursor-pointer transition">
              <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden sm:inline">Customer Service</span>
            </div>
            <span className="text-slate-500">|</span>
            <div className="flex items-center gap-1 text-slate-300 hover:text-white cursor-pointer">
              <Globe className="h-3.5 w-3.5" />
              <span>Español</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Red Brand Header Banner */}
      <header className="bg-[#D71E28] border-b-4 border-[#FFCD00] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size="lg" />
          </div>
          
          <div className="flex items-center gap-2 text-white text-xs font-semibold">
            <ShieldCheck className="h-4 w-4 text-[#FFCD00]" />
            <span className="hidden sm:inline text-red-100">Secure Online Banking</span>
          </div>
        </div>
      </header>

      {/* Main Portal Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Sign-On Form Card */}
          <div className="lg:col-span-6 xl:col-span-5">
            <div className="bg-white rounded-xl border border-slate-300 shadow-xl overflow-hidden">
              
              {/* Form Header with Red Accent Bar */}
              <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                    Sign On to View Your Accounts
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Well Fergo Online® & Mobile Banking
                  </p>
                </div>
                <div className="h-9 w-9 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-[#D71E28]">
                  <Lock className="h-5 w-5" />
                </div>
              </div>

              <div className="p-6 sm:p-7 space-y-5">
                
                {/* Error Banner */}
                {errorMessage && (
                  <div className="rounded-lg bg-red-50 p-3.5 border-l-4 border-[#D71E28] flex items-center gap-3 text-red-800 text-xs animate-fadeIn shadow-xs">
                    <AlertCircle className="h-5 w-5 text-[#D71E28] shrink-0" />
                    <span className="font-semibold">{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Username Field */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Username
                      </label>
                      <span className="text-[11px] text-slate-400">Required</span>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          if (errorMessage) setErrorMessage('');
                        }}
                        placeholder="Enter username"
                        className="w-full rounded-lg bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 border border-slate-300 focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28] focus:outline-none transition shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Password
                      </label>
                      <span className="text-[11px] text-slate-400">Required</span>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errorMessage) setErrorMessage('');
                        }}
                        placeholder="Enter password"
                        className="w-full rounded-lg bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 border border-slate-300 focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28] focus:outline-none transition shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Save Username & Forgot Links */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={saveUsername}
                        onChange={(e) => setSaveUsername(e.target.checked)}
                        className="rounded border-slate-300 text-[#D71E28] focus:ring-[#D71E28] h-4 w-4"
                      />
                      <span className="text-xs text-slate-700 font-medium">Save username</span>
                    </label>

                    <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-xs text-[#D71E28] hover:underline font-semibold">
                      Forgot password?
                    </a>
                  </div>

                  {/* Sign On Button (Authentic Red Button) */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-3 flex items-center justify-center gap-2.5 rounded-lg bg-[#D71E28] hover:bg-[#b8141d] active:bg-[#990f17] py-3 px-4 text-sm font-bold text-white shadow-md transition disabled:opacity-75 cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Signing On...</span>
                      </div>
                    ) : (
                      <>
                        <span>Sign On</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Enrollment & Links */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Not enrolled yet?</span>
                  <a 
                    href="#enroll" 
                    onClick={(e) => e.preventDefault()}
                    className="font-bold text-[#D71E28] hover:underline"
                  >
                    Enroll in Online Banking
                  </a>
                </div>

              </div>

            </div>
          </div>

          {/* Right Column: Authentic Wells Fargo Promotional Highlights */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-6">
            
            {/* Banner: Feature Highlights Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-[#D71E28] font-bold text-xs">
                  <Smartphone className="h-4 w-4" />
                  <span>Well Fergo Mobile®</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  Manage finances on the go
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Deposit checks, pay electricity & utility bills, send money with Zelle®, and view statements securely.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                  <Award className="h-4 w-4" />
                  <span>Credit Close-Up®</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  Track Your FICO® Score 9
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Access your monthly credit score for free with no impact on your credit history or rating.
                </p>
              </div>

            </div>

            {/* Quick Assurance Badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>FDIC Insured up to $250,000</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Equal Housing Lender</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>24/7 Customer Support</span>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Official Banking Footer */}
      <footer className="bg-white border-t border-slate-300 py-6 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-slate-200">
            <div className="flex flex-wrap gap-x-6 gap-y-2 font-medium text-slate-600 text-[11px]">
              <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:underline">Privacy, Cookies & Security</a>
              <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:underline">Online Access Agreement</a>
              <a href="#disclosures" onClick={(e) => e.preventDefault()} className="hover:underline">Account Disclosures</a>
              <a href="#security" onClick={(e) => e.preventDefault()} className="hover:underline">Security Center</a>
              <a href="#routing" onClick={(e) => e.preventDefault()} className="hover:underline">Routing Numbers</a>
            </div>
            <div className="text-[11px] font-bold text-slate-700">
              Well Fergo N.A. Member FDIC
            </div>
          </div>
          
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Investment and Insurance Products are: Not Insured by the FDIC or Any Federal Government Agency • Not a Deposit or Other Obligation of, or Guaranteed by, the Bank or Any Bank Affiliate • Subject to Investment Risks, Including Possible Loss of the Principal Amount Invested.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] text-slate-400 pt-1">
            <span>© 2026 Well Fergo Online Banking. All rights reserved.</span>
            <span>Equal Housing Lender ⌂</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
