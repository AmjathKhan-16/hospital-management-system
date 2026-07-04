import { useEffect, useState } from 'react';
import api from '../services/api.js';

const DoctorPage = () => {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [recordForm, setRecordForm] = useState({ patientId: '', diagnosis: '', prescription: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    const [p, a] = await Promise.all([
      api.get('/doctors/me'),
      api.get('/doctors/me/appointments')
    ]);
    setProfile(p.data);
    setAppointments(a.data);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    const { data } = await api.patch(`/doctors/appointments/${id}`, { status });
    setAppointments((prev) => prev.map((a) => (a._id === id ? data : a)));
  };

  const submitRecord = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.post('/doctors/records', recordForm);
      setMessage('Medical record added.');
      setRecordForm({ patientId: '', diagnosis: '', prescription: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to add record');
    }
  };

  return (
    <div className="container">
      <section className="page-header compact">
        <div>
          <p className="eyebrow">Doctor workspace</p>
          <h1>{profile?.userId?.name || 'Clinical queue'}</h1>
          <p>Review patient requests, approve or reject visits, and complete records.</p>
        </div>
      </section>

      {message && <p className="notice success">{message}</p>}
      {error && <p className="notice error">{error}</p>}

      {profile && (
        <div className="card profile-card">
          <div><span className="badge">{profile.specialization}</span><h2>{profile.availability}</h2></div>
          <p>{profile.userId?.email}</p>
        </div>
      )}

      <div className="card table-card">
        <h2>Appointments</h2>
        <table className="table">
          <thead><tr><th>Patient</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a._id}>
                <td>{a.patientId?.userId?.name || 'Patient'}<br /><small>{a.patientId?._id}</small></td>
                <td>{new Date(a.date).toLocaleString()}</td>
                <td><span className={`badge status-${a.status}`}>{a.status}</span></td>
                <td className="action-row">
                  <button className="btn small" onClick={() => updateStatus(a._id, 'approved')}>Approve</button>
                  <button className="btn small secondary" onClick={() => updateStatus(a._id, 'rejected')}>Reject</button>
                  <button className="btn small ghost" onClick={() => updateStatus(a._id, 'completed')}>Complete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>Add medical record</h2>
        <form onSubmit={submitRecord}>
          <div className="two-column">
            <div className="form-group"><label>Patient ID</label><input value={recordForm.patientId} onChange={(e) => setRecordForm({ ...recordForm, patientId: e.target.value })} required /></div>
            <div className="form-group"><label>Diagnosis</label><input value={recordForm.diagnosis} onChange={(e) => setRecordForm({ ...recordForm, diagnosis: e.target.value })} required /></div>
          </div>
          <div className="form-group"><label>Prescription</label><textarea rows="3" value={recordForm.prescription} onChange={(e) => setRecordForm({ ...recordForm, prescription: e.target.value })} required /></div>
          <button className="btn" type="submit">Save record</button>
        </form>
      </div>
    </div>
  );
};

export default DoctorPage;