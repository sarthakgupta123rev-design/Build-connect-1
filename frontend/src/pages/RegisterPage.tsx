import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, User, Briefcase, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CITIES } from '../mock/data';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<'customer' | 'worker'>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Jaipur');
  const [profession, setProfession] = useState('Electrician');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      await register(name, email, password, phone, city, role, profession);
      if (role === 'customer') {
        navigate('/workers');
      } else {
        navigate('/worker-profile');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 mx-auto">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
          </div>
        </div>
        <h1 className="text-3xl font-black text-white">Join BuildConnect</h1>
        <p className="text-xs text-gray-400">Create your verified account in under 2 minutes</p>
      </div>

      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-cyan-500/30 space-y-5">
        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              role === 'customer' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Customer</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('worker')}
            className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              role === 'worker' ? 'bg-cyan-600 text-white shadow-md' : 'text-gray-400'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Worker</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-gray-300 mb-1 block">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aarav Sharma"
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-gray-300 mb-1 block">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-gray-300 mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-gray-300 mb-1 block">Mobile Number (Aadhaar Linked)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-gray-300 mb-1 block">City Hub</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {role === 'worker' && (
            <div>
              <label className="font-semibold text-gray-300 mb-1 block">Primary Trade / Profession</label>
              <select
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
              >
                <option value="Electrician">Electrician</option>
                <option value="Plumber">Plumber</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Painter">Painter</option>
                <option value="AC Repair">AC Repair</option>
                <option value="Appliance Repair">Appliance Repair</option>
                <option value="Skilled Helper">Skilled Helper</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Register & Start ({role})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 font-bold hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};
