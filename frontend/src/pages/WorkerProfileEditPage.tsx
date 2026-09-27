import React, { useState } from 'react';
import { ShieldCheck, X, Save, CheckCircle2 } from 'lucide-react';
import { VerifiedBadge } from '../components/VerifiedBadge';

export const WorkerProfileEditPage: React.FC = () => {
  const [name, setName] = useState('Rajesh Kumar');
  const [profession, setProfession] = useState('Electrician');
  const [city, setCity] = useState('Jaipur');
  const [area, setArea] = useState('Malviya Nagar');
  const [experienceYears, setExperienceYears] = useState(8);
  const [fixedRateMin, setFixedRateMin] = useState(400);
  const [fixedRateMax, setFixedRateMax] = useState(800);
  const [bio, setBio] = useState('Licensed industrial electrician with 8+ years of residential and commercial experience in Jaipur. Guaranteed neat work and safety compliance.');
  const [skills, setSkills] = useState<string[]>([
    'Short Circuit Repair',
    'AC Heavy Wiring',
    'DB Board Assembly',
    'Smart Home Switches',
    'Inverter Installation'
  ]);
  const [newSkill, setNewSkill] = useState('');
  const [saved, setSaved] = useState(false);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold mb-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>WORKER DIGITAL PROFILE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Worker Profile Settings</h1>
        <p className="text-sm text-gray-400 mt-1">
          Keep your skills, service area, and transparent pricing updated for local customer discovery.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Profile configuration saved successfully! Your digital trust score was re-indexed.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Verification Status Card */}
        <div className="glass-panel-glow rounded-3xl p-6 border border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80"
              alt="Profile"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-lg">{name}</h3>
                <VerifiedBadge size="sm" showText={true} />
              </div>
              <p className="text-xs text-gray-400">Aadhaar Verified • Skill Badge Certified</p>
            </div>
          </div>
          <span className="text-xs font-bold text-cyan-400 px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-500/40">
            Trust Score: 96/100
          </span>
        </div>

        {/* Basic Information */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base pb-2 border-b border-slate-800">Basic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-gray-300 font-semibold mb-1 block">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="text-gray-300 font-semibold mb-1 block">Profession</label>
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="text-gray-300 font-semibold mb-1 block">City Hub</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="text-gray-300 font-semibold mb-1 block">Local Area</label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>
        </div>

        {/* Experience & Rates */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base pb-2 border-b border-slate-800">Experience & Service Rates</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-gray-300 font-semibold mb-1 block">Experience (Years)</label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="text-gray-300 font-semibold mb-1 block">Min Rate (₹)</label>
              <input
                type="number"
                value={fixedRateMin}
                onChange={(e) => setFixedRateMin(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="text-gray-300 font-semibold mb-1 block">Max Rate (₹)</label>
              <input
                type="number"
                value={fixedRateMax}
                onChange={(e) => setFixedRateMax(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>
        </div>

        {/* Skills Tag Management */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base pb-2 border-b border-slate-800">Specialized Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-gray-400 hover:text-rose-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add skill (e.g. Solar Inverter Setup)..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
            >
              Add Skill
            </button>
          </div>
        </div>

        {/* Bio */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3">
          <h3 className="font-bold text-white text-base">Professional Bio</h3>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-sm hover:brightness-110 transition shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Worker Profile</span>
        </button>
      </form>
    </div>
  );
};
