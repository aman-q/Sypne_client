import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Car, Edit2, Check, X, Clock, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import { getProfile, getMyBookings, updateProfile } from '../api/userApi';

const statusConfig = {
  pending:   { label: 'Pending',   color: 'bg-yellow-100 text-yellow-800',  icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800',     icon: CheckCircle },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800',   icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800',       icon: XCircle },
};

const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const BookingCard = ({ booking }) => {
  const cfg = statusConfig[booking.status] || statusConfig.pending;
  const Icon = cfg.icon;
  const days = Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / 86400000);
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {booking.car?.images?.[0] ? (
            <img src={booking.car.images[0]} alt={booking.car.title} className="w-16 h-12 object-cover rounded-xl" />
          ) : (
            <div className="w-16 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <Car className="text-gray-400" size={20} />
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">{booking.car?.title || 'Car'}</p>
            <p className="text-xs text-gray-500">{booking.car?.company}</p>
          </div>
        </div>
        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
          <Icon size={12} />
          <span>{cfg.label}</span>
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-gray-400 text-xs">Pick-up</p>
          <p className="font-medium text-gray-800">{fmtDate(booking.startDate)}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Return</p>
          <p className="font-medium text-gray-800">{fmtDate(booking.endDate)}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Duration</p>
          <p className="font-medium text-gray-800">{days}d</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
        <span className="text-xs text-gray-400 font-mono">#{booking._id.slice(-8).toUpperCase()}</span>
        <span className="font-bold text-gray-900">${booking.price}</span>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ fname: '', lname: '', phonenumber: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [profileData, bookingsData] = await Promise.all([
          getProfile(),
          getMyBookings(),
        ]);
        setProfile(profileData.user);
        setEditForm({
          fname: profileData.user.fname,
          lname: profileData.user.lname,
          phonenumber: profileData.user.phonenumber || '',
        });
        setBookings({
          upcoming: bookingsData.upcoming || [],
          past: bookingsData.past || [],
        });
      } catch {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await updateProfile(editForm);
      setProfile(data.user);
      // update displayed name in navbar
      const stored = JSON.parse(localStorage.getItem('userinfo') || '{}');
      localStorage.setItem('userinfo', JSON.stringify({
        ...stored,
        firstName: data.user.fname,
        lastName: data.user.lname,
      }));
      setEditing(false);
      showToast('success', 'Profile updated successfully.');
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16"><Spinner /></div>
      </div>
    );
  }

  const totalSpent = [...bookings.upcoming, ...bookings.past]
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.price, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm px-5 py-4 rounded-xl shadow-xl border text-sm font-medium flex items-center space-x-3 ${
          toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <span>{toast.type === 'success' ? '✅' : '❌'}</span>
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-auto opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">

        {/* Profile card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {profile?.fname?.[0]?.toUpperCase()}{profile?.lname?.[0]?.toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{profile?.fname} {profile?.lname}</h1>
                <p className="text-sm text-gray-500 flex items-center space-x-1">
                  <Mail size={13} />
                  <span>{profile?.email}</span>
                </p>
              </div>
            </div>

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                <Edit2 size={15} />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
                >
                  <Check size={15} />
                  <span>{saving ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                  onClick={() => { setEditing(false); setEditForm({ fname: profile.fname, lname: profile.lname, phonenumber: profile.phonenumber || '' }); }}
                  className="flex items-center space-x-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                  <X size={15} />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {editing ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">First Name</label>
                  <input
                    value={editForm.fname}
                    onChange={e => setEditForm(f => ({ ...f, fname: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Last Name</label>
                  <input
                    value={editForm.lname}
                    onChange={e => setEditForm(f => ({ ...f, lname: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Phone Number</label>
                  <input
                    value={editForm.phonenumber}
                    onChange={e => setEditForm(f => ({ ...f, phonenumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 9876543210"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <User size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Full Name</p>
                    <p className="text-sm font-medium text-gray-800">{profile?.fname} {profile?.lname}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <Phone size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Phone</p>
                    <p className="text-sm font-medium text-gray-800">{profile?.phonenumber || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Member Since</p>
                    <p className="text-sm font-medium text-gray-800">{fmtDate(profile?.createdAt)}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Stats row */}
          <div className="mt-5 grid grid-cols-3 gap-3 pt-5 border-t border-gray-100">
            {[
              { value: bookings.upcoming.length + bookings.past.length, label: 'Total Bookings', color: 'text-gray-900' },
              { value: bookings.upcoming.length, label: 'Upcoming', color: 'text-blue-600' },
              { value: `$${totalSpent.toLocaleString()}`, label: 'Total Spent', color: 'text-green-600' },
            ].map(({ value, label, color }) => (
              <div key={label} className="text-center py-2">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bookings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">My Bookings</h2>
            <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
              {['upcoming', 'past'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                    activeTab === tab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab} ({bookings[tab].length})
                </button>
              ))}
            </div>
          </div>

          {bookings[activeTab].length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Car className="text-gray-400" size={24} />
              </div>
              <p className="text-gray-500 font-medium">
                {activeTab === 'upcoming' ? 'No upcoming trips' : 'No past trips yet'}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {activeTab === 'upcoming' ? "You have no bookings yet. Explore our cars to get started!" : ''}
              </p>
              {activeTab === 'upcoming' && (
                <a
                  href="/"
                  className="inline-block mt-4 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition"
                >
                  Browse Cars
                </a>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings[activeTab].map(booking => (
                <BookingCard key={booking._id} booking={booking} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
