import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function ChildPassport() {
  const { user } = useContext(AuthContext);
  const [passportData, setPassportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    child_name: '', udid: '', age: '', blood_group: '',
    contact1_relation: '', contact1_phone: '',
    contact2_relation: '', contact2_phone: '',
    allergies: '', communication_style: '',
    triggers: '', strategies: '', comfort_items: ''
  });

  useEffect(() => {
    if (user?.id) fetchPassport();
  }, [user]);

  const fetchPassport = async () => {
    try {
      const response = await API.get(`/health/passport/${user.id}`);
      setPassportData(response.data);
      setIsEditing(false);
    } catch (error) {
      if (error.response?.status === 404) setIsEditing(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      parent_id: user.id,
      child_name: formData.child_name,
      udid: formData.udid,
      age: parseInt(formData.age) || null,
      blood_group: formData.blood_group,
      allergies: formData.allergies,
      communication_style: formData.communication_style,
      comfort_items: formData.comfort_items,
      emergency_contacts: [
        { relation: formData.contact1_relation, phone: formData.contact1_phone },
        { relation: formData.contact2_relation, phone: formData.contact2_phone }
      ].filter(c => c.relation && c.phone),
      triggers: formData.triggers.split(',').map(t => t.trim()).filter(t => t),
      strategies: formData.strategies
    };

    try {
      const response = await API.post('/health/passport', payload);
      setPassportData(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save passport", error);
      alert("Error saving data.");
    } finally {
      setLoading(false);
    }
  };

  const enableEditMode = () => {
    if (passportData) {
      setFormData({
        child_name: passportData.child_name || '',
        udid: passportData.udid || '',
        age: passportData.age || '',
        blood_group: passportData.blood_group || '',
        allergies: passportData.allergies || '',
        communication_style: passportData.communication_style || '',
        comfort_items: passportData.comfort_items || '',
        contact1_relation: passportData.emergency_contacts?.[0]?.relation || '',
        contact1_phone: passportData.emergency_contacts?.[0]?.phone || '',
        contact2_relation: passportData.emergency_contacts?.[1]?.relation || '',
        contact2_phone: passportData.emergency_contacts?.[1]?.phone || '',
        triggers: passportData.triggers?.join(', ') || '',
        strategies: passportData.strategies || ''
      });
    }
    setIsEditing(true);
  };

  if (loading) return <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center font-bold text-slate-500 animate-pulse">Loading Secure Passport...</div>;

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#0b132b]">Dynamic Child Passport</h1>
            <p className="text-slate-600 font-medium mt-1">Comprehensive emergency and sensory profile.</p>
          </div>
          <Link to="/?role=parent" className="px-4 py-2 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 shadow-sm">
            ← Back to Dashboard
          </Link>
        </header>

        {isEditing ? (
          <form onSubmit={handleSave} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <h2 className="text-xl font-black text-[#0b132b] border-b pb-4">📝 {passportData ? 'Update' : 'Create'} Passport</h2>
            
            <div className="grid md:grid-cols-4 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">Child Name</label>
                <input required type="text" value={formData.child_name} onChange={e => setFormData({...formData, child_name: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:border-[#0b132b]" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">Age</label>
                <input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:border-[#0b132b]" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">Blood Group</label>
                <input type="text" placeholder="e.g. O+" value={formData.blood_group} onChange={e => setFormData({...formData, blood_group: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:border-[#0b132b]" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">UDID</label>
                <input type="text" value={formData.udid} onChange={e => setFormData({...formData, udid: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:border-[#0b132b]" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">Communication Style</label>
                <input type="text" placeholder="e.g., Non-verbal, Uses AAC" value={formData.communication_style} onChange={e => setFormData({...formData, communication_style: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:border-[#0b132b]" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 bg-red-50 p-4 rounded-xl border border-red-100">
              <div>
                <label className="block text-xs font-black uppercase text-red-800 mb-1">Primary Contact (Relation)</label>
                <input type="text" placeholder="e.g. Father" value={formData.contact1_relation} onChange={e => setFormData({...formData, contact1_relation: e.target.value})} className="w-full p-2.5 rounded-xl border border-red-200 text-sm mb-2" />
                <input type="text" placeholder="Phone Number" value={formData.contact1_phone} onChange={e => setFormData({...formData, contact1_phone: e.target.value})} className="w-full p-2.5 rounded-xl border border-red-200 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-red-800 mb-1">Secondary Contact (Relation)</label>
                <input type="text" placeholder="e.g. Therapist" value={formData.contact2_relation} onChange={e => setFormData({...formData, contact2_relation: e.target.value})} className="w-full p-2.5 rounded-xl border border-red-200 text-sm mb-2" />
                <input type="text" placeholder="Phone Number" value={formData.contact2_phone} onChange={e => setFormData({...formData, contact2_phone: e.target.value})} className="w-full p-2.5 rounded-xl border border-red-200 text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-red-600 mb-1">Allergies & Dietary Restrictions</label>
              <input type="text" placeholder="e.g. Peanut allergy, Gluten-free" value={formData.allergies} onChange={e => setFormData({...formData, allergies: e.target.value})} className="w-full p-3 rounded-xl border border-red-200 text-sm focus:border-red-500 bg-red-50/50" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">Sensory Triggers (Comma separated)</label>
                <textarea rows="2" value={formData.triggers} onChange={e => setFormData({...formData, triggers: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:border-[#0b132b]" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">Comfort Items / Safe Topics</label>
                <textarea rows="2" placeholder="e.g., Blue dinosaur toy, singing wheels on the bus" value={formData.comfort_items} onChange={e => setFormData({...formData, comfort_items: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:border-[#0b132b]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-1">De-escalation Strategies</label>
              <textarea rows="3" value={formData.strategies} onChange={e => setFormData({...formData, strategies: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:border-[#0b132b]" />
            </div>

            <div className="flex gap-4">
              <button type="submit" className="px-6 py-3 bg-[#0b132b] text-white font-bold rounded-xl shadow-md hover:bg-slate-800 transition">Save Passport</button>
              {passportData && <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50">Cancel</button>}
            </div>
          </form>
        ) : (
          <div className="bg-white p-10 rounded-3xl shadow-xl border-4 border-slate-100 space-y-6 animate-fade-in-up print:shadow-none print:border-none print:p-0">
            <div className="flex flex-col md:flex-row justify-between items-start border-b border-slate-100 pb-6 gap-4">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h2 className="text-4xl font-black text-[#0b132b] uppercase tracking-tight">{passportData.child_name}</h2>
                  {passportData.blood_group && (
                    <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-black shadow-sm">🩸 {passportData.blood_group}</span>
                  )}
                </div>
                <p className="text-slate-500 font-bold mt-1 bg-slate-50 inline-block px-3 py-1 rounded-md border border-slate-200">
                  UDID: {passportData.udid || 'N/A'} | Age: {passportData.age || 'N/A'}
                </p>
              </div>
              <div className="flex flex-col items-end gap-3 print:hidden">
                <div className="flex gap-3">
                  <button onClick={enableEditMode} className="px-5 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition">Edit</button>
                  <button onClick={() => window.print()} className="px-6 py-2 bg-[#0b132b] text-white font-bold rounded-xl shadow-md hover:bg-slate-800 transition flex items-center gap-2">
                    🖨️ Print
                  </button>
                </div>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                  ✓ Last Updated: {new Date(passportData.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Critical Alerts Row */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 bg-red-50 rounded-2xl border-l-4 border-red-500 shadow-sm flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h3 className="font-black text-red-900 text-xs uppercase tracking-wider mb-1">Medical & Allergies</h3>
                  <p className="text-sm font-bold text-red-800">{passportData.allergies || "No known allergies documented."}</p>
                </div>
              </div>
              <div className="p-5 bg-blue-50 rounded-2xl border-l-4 border-blue-500 shadow-sm flex items-start gap-3">
                <span className="text-2xl">💬</span>
                <div>
                  <h3 className="font-black text-blue-900 text-xs uppercase tracking-wider mb-1">Communication Style</h3>
                  <p className="text-sm font-bold text-blue-800">{passportData.communication_style || "Standard verbal."}</p>
                </div>
              </div>
            </div>

            {/* Contacts & Triggers Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">🚨 Emergency Contacts</h3>
                <div className="space-y-3">
                  {passportData.emergency_contacts?.map((contact, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider">{contact.relation}</p>
                      <p className="text-sm font-black text-slate-900 mt-0.5">{contact.phone}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-orange-50 rounded-2xl border border-orange-200">
                <h3 className="font-black text-orange-900 mb-4 flex items-center gap-2">⚡ Sensory Triggers</h3>
                <ul className="space-y-2">
                  {passportData.triggers?.map((trigger, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm font-bold text-orange-900 bg-white p-2.5 rounded-xl border border-orange-100 shadow-sm">
                      <span className="text-orange-500">•</span>{trigger}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Strategies & Comfort Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-yellow-50 rounded-2xl border border-yellow-200">
                <h3 className="font-black text-yellow-900 mb-3 flex items-center gap-2">💡 De-escalation Strategies</h3>
                <p className="text-sm text-yellow-900 leading-relaxed font-semibold">
                  {passportData.strategies || "No strategies documented."}
                </p>
              </div>
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
                <h3 className="font-black text-emerald-900 mb-3 flex items-center gap-2">🧸 Comfort Items & Safe Words</h3>
                <p className="text-sm text-emerald-900 leading-relaxed font-semibold">
                  {passportData.comfort_items || "No comfort items documented."}
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}