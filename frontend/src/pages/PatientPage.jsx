import { useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';
import { medicalCategories } from '../data/medicalCategories.js';

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

const PatientPage = () => {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [category, setCategory] = useState('all');
  const [form, setForm] = useState({ doctorId: '', date: '', timeSlot: '', notes: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    const [p, a, r, d] = await Promise.all([
      api.get('/patients/me'),
      api.get('/patients/me/appointments'),
      api.get('/patients/me/records'),
      api.get('/doctors')
    ]);
    setProfile(p.data);
    setAppointments(a.data);
    setRecords(r.data);
    setDoctors(d.data);
  };

  useEffect(() => {
    load();
  }, []);

  const categories = useMemo(() => ['all', ...medicalCategories.map((item) => item.name)], []);
  const selectedInfo = medicalCategories.find((item) => item.name === category);
  const filteredDoctors = category === 'all' ? doctors : doctors.filter((d) => d.specialization === category);
  const selectedDoctor = doctors.find((doctor) => doctor._id === form.doctorId);
  const selectedDoctorInfo = medicalCategories.find((item) => item.name === selectedDoctor?.specialization);
  const appointmentDateTime = toDateTimeValue(form.date, form.timeSlot);

  const book = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!appointmentDateTime) {
      setError('Please choose appointment date and time slot');
      return;
    }

    try {
      const { data } = await api.post('/appointments', {
        doctorId: form.doctorId,
        date: appointmentDateTime,
        notes: form.notes
      });
      setAppointments((prev) => [...prev, data]);
      setForm({ doctorId: '', date: '', timeSlot: '', notes: '' });
      setMessage('Appointment request sent. Wait for admin or doctor approval.');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to book appointment');
    }
  };

  return (
    <div className="container">
      <section className="page-header compact">
        <div>
          <p className="eyebrow">Patient portal</p>
          <h1>{profile?.userId?.name || 'My care'}</h1>
          <p>Choose a category, select a doctor, review doctor information, choose a time slot, and book an appointment.</p>
        </div>
      </section>

      {message && <p className="notice success">{message}</p>}
      {error && <p className="notice error">{error}</p>}

      {profile && (
        <div className="card profile-card">
          <div><span className="badge">Profile</span><h2>{profile.gender}, {profile.age}</h2></div>
          <p>{profile.medicalHistory || 'No medical history added.'}</p>
        </div>
      )}

      <div className="card-grid patient-grid">
        <div className="card">
          <h2>Book appointment</h2>
          <form onSubmit={book}>
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => { setCategory(e.target.value); setForm({ ...form, doctorId: '' }); }}>
                {categories.map((item) => <option key={item} value={item}>{item === 'all' ? 'All categories' : item}</option>)}
              </select>
            </div>
            {selectedInfo && (
              <div className="category-note">
                <strong>{selectedInfo.subtitle}</strong>
                <small>{selectedInfo.illnesses.join(', ')}</small>
              </div>
            )}
            <div className="form-group">
              <label>Select doctor</label>
              <select value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })} required>
                <option value="">{filteredDoctors.length ? 'Choose a doctor' : 'No doctor available'}</option>
                {filteredDoctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>{doctor.userId?.name} - {doctor.specialization}</option>
                ))}
              </select>
            </div>

            {!selectedDoctor && (
              <div className="selected-doctor-card empty-doctor-card">
                <strong>Select doctor</strong>
                <small>{filteredDoctors.length ? 'Choose a doctor from the dropdown to see full doctor information.' : 'Default doctors will appear after the backend restarts and seeds the database.'}</small>
              </div>
            )}

            {selectedDoctor && (
              <div className="selected-doctor-card">
                <div className="doctor-strip selected-doctor-head">
                  <span className="doctor-avatar">{(selectedDoctor.userId?.name || 'D').charAt(0)}</span>
                  <div>
                    <strong>{selectedDoctor.userId?.name}</strong>
                    <small>{selectedDoctor.specialization}</small>
                  </div>
                </div>
                <div className="doctor-info-grid">
                  <div><span>Email</span><strong>{selectedDoctor.userId?.email || 'Not provided'}</strong></div>
                  <div><span>Availability</span><strong>{selectedDoctor.availability || 'Not provided'}</strong></div>
                  <div><span>Department</span><strong>{selectedDoctorInfo?.subtitle || selectedDoctor.specialization}</strong></div>
                  <div><span>Common symptoms</span><strong>{selectedDoctorInfo?.symptoms?.slice(0, 3).join(', ') || 'Consultation required'}</strong></div>
                </div>
                {selectedDoctorInfo && (
                  <div className="category-note compact-note">
                    <strong>Common illnesses handled</strong>
                    <small>{selectedDoctorInfo.illnesses.join(', ')}</small>
                  </div>
                )}
              </div>
            )}

            <div className="two-column">
              <div className="form-group">
                <label>Appointment date</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value, timeSlot: '' })} required />
              </div>
              <div className="form-group">
                <label>Time slot</label>
                <select value={form.timeSlot} onChange={(e) => setForm({ ...form, timeSlot: e.target.value })} required disabled={!form.date}>
                  <option value="">{form.date ? 'Choose time slot' : 'Choose date first'}</option>
                  {timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                </select>
              </div>
            </div>

            {form.date && (
              <div className="slot-grid">
                {timeSlots.map((slot) => (
                  <button
                    className={`slot-button ${form.timeSlot === slot ? 'active' : ''}`}
                    key={slot}
                    type="button"
                    onClick={() => setForm({ ...form, timeSlot: slot })}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}

            {appointmentDateTime && <p className="helper-text">Selected appointment: {new Date(appointmentDateTime).toLocaleString()}</p>}

            <div className="form-group"><label>Reason or symptoms</label><textarea rows="3" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
            <button className="btn" type="submit" disabled={!filteredDoctors.length}>Request appointment</button>
          </form>
          {!filteredDoctors.length && <p className="helper-text">No doctor has been added for this category yet. Restart the backend once to load default doctors.</p>}
        </div>

        <div className="card">
          <h2>Doctors and categories</h2>
          <div className="badge-row">{medicalCategories.map((item) => <span className="badge" key={item.name}>{item.name}</span>)}</div>
          {filteredDoctors.map((doctor) => (
            <button className="list-item doctor-list-button" key={doctor._id} onClick={() => setForm({ ...form, doctorId: doctor._id })}>
              <strong>{doctor.userId?.name}</strong>
              <span>{doctor.specialization}</span>
              <small>{doctor.availability}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="card table-card">
        <h2>Appointment history</h2>
        <table className="table">
          <thead><tr><th>Doctor</th><th>Date</th><th>Status</th><th>Notes</th></tr></thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a._id}>
                <td>{a.doctorId?.userId?.name || 'Doctor'}<br /><small>{a.doctorId?.specialization}</small></td>
                <td>{new Date(a.date).toLocaleString()}</td>
                <td><span className={`badge status-${a.status}`}>{a.status}</span></td>
                <td>{a.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>Medical records</h2>
        {records.length === 0 && <p className="helper-text">No records added yet.</p>}
        {records.map((r) => (
          <div key={r._id} className="list-item">
            <strong>Diagnosis: {r.diagnosis}</strong>
            <span>Prescription: {r.prescription}</span>
            <small>Doctor: {r.doctorId?.userId?.name || r.doctorId?.specialization}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientPage;