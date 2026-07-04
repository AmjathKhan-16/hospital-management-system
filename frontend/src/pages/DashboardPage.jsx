import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { medicalCategories } from '../data/medicalCategories.js';

const emptyProfileForm = {
  age: '',
  gender: 'other',
  medicalHistory: '',
  location: '',
  parentName: '',
  parentPhone: '',
  guardianName: '',
  guardianPhone: '',
  phone: '',
  emergencyContact: '',
  photoUrl: ''
};

const statusLabels = ['pending', 'approved', 'rejected', 'rescheduled', 'completed'];

const timeSlots = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM'
];

const toDateTimeValue = (date, slot) => {
  if (!date || !slot) return '';
  const [time, period] = slot.split(' ');
  const [rawHour, minute] = time.split(':').map(Number);
  const hour = period === 'PM' && rawHour !== 12 ? rawHour + 12 : period === 'AM' && rawHour === 12 ? 0 : rawHour;
  return `${date}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

const DashboardPage = ({ user, onUserUpdate }) => {
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [openCategory, setOpenCategory] = useState(null);
  const [profileForm, setProfileForm] = useState(emptyProfileForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPhotoEdit, setShowPhotoEdit] = useState(false);
  const [rescheduleForm, setRescheduleForm] = useState({ appointmentId: '', date: '', timeSlot: '' });

  const loadPatientData = async () => {
    const [profileRes, appointmentsRes] = await Promise.all([
      api.get('/patients/me'),
      api.get('/patients/me/appointments')
    ]);
    setProfile(profileRes.data);
    setAppointments(appointmentsRes.data);
    setProfileForm({
      age: profileRes.data.age ?? '',
      gender: profileRes.data.gender || 'other',
      medicalHistory: profileRes.data.medicalHistory || '',
      location: profileRes.data.location || '',
      parentName: profileRes.data.parentName || '',
      parentPhone: profileRes.data.parentPhone || '',
      guardianName: profileRes.data.guardianName || '',
      guardianPhone: profileRes.data.guardianPhone || '',
      phone: profileRes.data.phone || '',
      emergencyContact: profileRes.data.emergencyContact || '',
      photoUrl: profileRes.data.photoUrl || ''
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user?.role === 'admin') {
        const { data } = await api.get('/admin/stats');
        setStats(data);
        return;
      }

      if (user?.role === 'patient') {
        await loadPatientData();
      }

      if (user?.role === 'doctor') {
        const [profileRes, appointmentsRes] = await Promise.all([
          api.get('/doctors/me'),
          api.get('/doctors/me/appointments')
        ]);
        setProfile(profileRes.data);
        setAppointments(appointmentsRes.data);
      }
    };

    fetchData();
  }, [user]);

  const cards = [
    { title: 'Users', value: stats?.users ?? 0, text: 'All verified staff and patient accounts' },
    { title: 'Doctors', value: stats?.doctors ?? 0, text: 'Available specialists by category' },
    { title: 'Patients', value: stats?.patients ?? 0, text: 'Registered patient profiles' },
    { title: 'Appointments', value: stats?.appointments ?? appointments.length, text: 'Pending, approved, rejected, completed' }
  ];

  const recentCategories = useMemo(() => medicalCategories.slice(0, 8), []);
  const profilePhotoUrl = profileForm.photoUrl || profile?.photoUrl || user?.photoUrl || '';
  const statusCounts = statusLabels.map((status) => ({ status, count: appointments.filter((a) => a.status === status).length }));
  const maxStatusCount = Math.max(1, ...statusCounts.map((item) => item.count));

  const savePatientProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const { data } = await api.patch('/patients/me', profileForm);
      setProfile(data);
      setProfileForm((current) => ({ ...current, photoUrl: data.photoUrl || current.photoUrl }));
      setShowPhotoEdit(false);
      setMessage('Profile information saved to database.');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.statusText || err.message || 'Unable to save profile');
    }
  };

  const saveProfilePhoto = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const { data } = await api.patch('/auth/me/photo', { photoUrl: profileForm.photoUrl });
      onUserUpdate?.(data);
      setShowPhotoEdit(false);
      setMessage('Profile photo saved.');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.statusText || err.message || 'Unable to save photo');
    }
  };

  const handlePhotoFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 520;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const compressedPhoto = canvas.toDataURL('image/jpeg', 0.78);
        setProfileForm((current) => ({ ...current, photoUrl: compressedPhoto }));
        setMessage('Photo selected. Click Save photo to store it.');
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const startReschedule = (appointment) => {
    const date = new Date(appointment.date);
    const dateValue = Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
    setRescheduleForm({ appointmentId: appointment._id, date: dateValue, timeSlot: '' });
  };

  const submitReschedule = async (appointmentId) => {
    const nextDate = toDateTimeValue(rescheduleForm.date, rescheduleForm.timeSlot);
    if (!nextDate) {
      setError('Choose a new date and time slot to reschedule.');
      return;
    }

    setMessage('');
    setError('');
    try {
      const { data } = await api.patch(`/appointments/${appointmentId}/reschedule`, { date: nextDate });
      setAppointments((current) => current.map((appointment) => (appointment._id === appointmentId ? data : appointment)));
      setRescheduleForm({ appointmentId: '', date: '', timeSlot: '' });
      setMessage('Appointment rescheduled successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reschedule appointment');
    }
  };

  return (
    <div className="container">
      <section className="page-header dashboard-header">
        <div>
          <p className="eyebrow">{user?.role} workspace</p>
          <h1>Welcome back, {user?.name}</h1>
          <p>Manage hospital access, appointment flow, and patient care from your role-based dashboard.</p>
        </div>
        <div className="user-info-panel profile-summary-panel">
          <div className="profile-cover-card basic-avatar-card">
            <div className="avatar-frame basic-avatar-frame">
              {profilePhotoUrl ? (
                <img className="avatar-photo" src={profilePhotoUrl} alt="User profile" />
              ) : (
                <div className="avatar-placeholder"><span /></div>
              )}
            </div>
          </div>
          <button className="edit-photo-button" type="button" onClick={() => setShowPhotoEdit((value) => !value)}>Edit photo</button>
          {showPhotoEdit && (
            <form className="photo-edit-form" onSubmit={saveProfilePhoto}>
              <label>Choose photo from phone or laptop</label>
              <input type="file" accept="image/*" onChange={handlePhotoFile} />
              <button className="btn small" type="submit">Save photo</button>
            </form>
          )}
          <span className="badge">User information</span>
          <strong>{user?.name}</strong>
          <small>{user?.email}</small>
          <small>Role: {user?.role}</small>
          {profile?.specialization && <small>Department: {profile.specialization}</small>}
          {profile?.age !== undefined && <small>Age: {profile.age} - Gender: {profile.gender}</small>}
          {profile?.location && <small>Location: {profile.location}</small>}
          {profile?.guardianName && <small>Guardian: {profile.guardianName}</small>}
        </div>
      </section>

      {message && <p className="notice success">{message}</p>}
      {error && <p className="notice error">{error}</p>}

      {user?.role === 'admin' && stats && (
        <div className="metric-grid">
          {cards.map((card) => (
            <div className="metric-card" key={card.title}>
              <span className="badge">{card.title}</span>
              <strong>{card.value}</strong>
              <p>{card.text}</p>
            </div>
          ))}
        </div>
      )}

      {user?.role !== 'admin' && (
        <div className="metric-grid">
          <div className="metric-card"><span className="badge">Appointments</span><strong>{appointments.length}</strong><p>Total appointments connected to your account.</p></div>
          <div className="metric-card"><span className="badge">Pending</span><strong>{appointments.filter((a) => a.status === 'pending').length}</strong><p>Waiting for doctor or admin response.</p></div>
          <div className="metric-card"><span className="badge">Completed</span><strong>{appointments.filter((a) => a.status === 'completed').length}</strong><p>Finished visits and care records.</p></div>
        </div>
      )}

      {user?.role === 'patient' && (
        <div className="card-grid patient-dashboard-grid">
          <section className="card">
            <h2>Patient information</h2>
            <form onSubmit={savePatientProfile}>
              <div className="two-column">
                <div className="form-group"><label>Location</label><input value={profileForm.location} onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })} placeholder="City, area, address" /></div>
                <div className="form-group"><label>Phone</label><input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} /></div>
                <div className="form-group"><label>Emergency contact</label><input value={profileForm.emergencyContact} onChange={(e) => setProfileForm({ ...profileForm, emergencyContact: e.target.value })} /></div>
                <div className="form-group"><label>Parent name</label><input value={profileForm.parentName} onChange={(e) => setProfileForm({ ...profileForm, parentName: e.target.value })} /></div>
                <div className="form-group"><label>Parent phone</label><input value={profileForm.parentPhone} onChange={(e) => setProfileForm({ ...profileForm, parentPhone: e.target.value })} /></div>
                <div className="form-group"><label>Guardian name</label><input value={profileForm.guardianName} onChange={(e) => setProfileForm({ ...profileForm, guardianName: e.target.value })} /></div>
                <div className="form-group"><label>Guardian phone</label><input value={profileForm.guardianPhone} onChange={(e) => setProfileForm({ ...profileForm, guardianPhone: e.target.value })} /></div>
                <div className="form-group"><label>Age</label><input type="number" value={profileForm.age} onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })} /></div>
                <div className="form-group"><label>Gender</label><select value={profileForm.gender} onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
              </div>
              <div className="form-group"><label>Medical history</label><textarea rows="3" value={profileForm.medicalHistory} onChange={(e) => setProfileForm({ ...profileForm, medicalHistory: e.target.value })} /></div>
              <button className="btn" type="submit">Save user information</button>
            </form>
          </section>

          <section className="card">
            <h2>Appointment diagram</h2>
            <div className="status-diagram">
              {statusCounts.map((item) => (
                <div className="status-bar-row" key={item.status}>
                  <span>{item.status}</span>
                  <div className="status-track"><div className={`status-fill status-${item.status}`} style={{ width: `${(item.count / maxStatusCount) * 100}%` }} /></div>
                  <strong>{item.count}</strong>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      <div className="card action-card">
        <div>
          <h2>{user?.role === 'patient' ? 'Book and track appointments' : user?.role === 'doctor' ? 'Review assigned appointments' : 'Manage hospital operations'}</h2>
          <p>{user?.role === 'patient' ? 'Open the patient portal to choose a doctor category and request an appointment.' : user?.role === 'doctor' ? 'Open the doctor workspace to approve, reject, or complete appointments.' : 'Open the admin center to add doctors, add patients, and review all appointment requests.'}</p>
        </div>
        <Link className="btn" to={user?.role === 'patient' ? '/patient' : user?.role === 'doctor' ? '/doctor' : '/admin'}>Open workspace</Link>
      </div>

      {user?.role !== 'admin' && (
        <section className="card table-card">
          <h2>User appointments</h2>
          <table className="table">
            <thead><tr><th>Doctor / Patient</th><th>Date</th><th>Status</th><th>Notes</th><th>Action</th></tr></thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment.doctorId?.userId?.name || appointment.patientId?.userId?.name || 'Appointment'}<br /><small>{appointment.doctorId?.specialization || appointment.patientId?._id}</small></td>
                  <td>{new Date(appointment.date).toLocaleString()}</td>
                  <td><span className={`badge status-${appointment.status}`}>{appointment.status}</span></td>
                  <td>{appointment.notes || '-'}</td>
                  <td>
                    {user?.role === 'patient' ? (
                      rescheduleForm.appointmentId === appointment._id ? (
                        <div className="reschedule-panel">
                          <input type="date" value={rescheduleForm.date} onChange={(e) => setRescheduleForm({ ...rescheduleForm, date: e.target.value, timeSlot: '' })} />
                          <select value={rescheduleForm.timeSlot} onChange={(e) => setRescheduleForm({ ...rescheduleForm, timeSlot: e.target.value })}>
                            <option value="">Time slot</option>
                            {timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                          </select>
                          <div className="action-row">
                            <button className="btn small" type="button" onClick={() => submitReschedule(appointment._id)}>Save</button>
                            <button className="btn small ghost" type="button" onClick={() => setRescheduleForm({ appointmentId: '', date: '', timeSlot: '' })}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button className="btn small ghost" type="button" onClick={() => startReschedule(appointment)}>Reschedule</button>
                      )
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section className="card">
        <div className="section-heading inline-heading">
          <div>
            <p className="eyebrow">Categories</p>
            <h2>Medical departments</h2>
          </div>
          <span className="helper-text">Details stay hidden until selected.</span>
        </div>
        <div className="category-grid compact-categories">
          {recentCategories.map((category) => {
            const isOpen = openCategory === category.name;
            return (
              <article className={`category-card ${isOpen ? 'expanded' : ''}`} key={category.name}>
                <button className="category-summary" onClick={() => setOpenCategory(isOpen ? null : category.name)}>
                  <span><strong>{category.name}</strong><small>{category.subtitle}</small></span>
                  <span className="expand-icon">{isOpen ? '-' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="category-details">
                    <p>{category.illnesses.join(', ')}</p>
                    <div className="doctor-strip"><span className="doctor-avatar">{category.doctor.name.split(' ').slice(-1)[0][0]}</span><div><strong>{category.doctor.name}</strong><small>{category.doctor.title}</small></div></div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
        <Link className="btn ghost" to="/">View all categories on Home</Link>
      </section>
    </div>
  );
};

export default DashboardPage;

