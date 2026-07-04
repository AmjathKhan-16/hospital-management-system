import { useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';

const initialDoctor = { name: '', email: '', password: '', specialization: 'General Medicine', availability: 'Mon-Fri, 9:00 AM - 5:00 PM' };
const initialPatient = { name: '', email: '', password: '', age: '', gender: 'male', medicalHistory: '' };

const AdminPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctorForm, setDoctorForm] = useState(initialDoctor);
  const [patientForm, setPatientForm] = useState(initialPatient);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    const [d, p, a] = await Promise.all([
      api.get('/admin/doctors'),
      api.get('/admin/patients'),
      api.get('/admin/appointments')
    ]);
    setDoctors(d.data);
    setPatients(p.data);
    setAppointments(a.data);
  };

  useEffect(() => {
    load();
  }, []);

  const categories = useMemo(() => [...new Set(doctors.map((d) => d.specialization))], [doctors]);

  const createDoctor = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.post('/admin/doctors', doctorForm);
      setDoctorForm(initialDoctor);
      setMessage('Doctor added successfully.');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to add doctor');
    }
  };

  const createPatient = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const { data } = await api.post('/admin/patients', patientForm);
      setPatientForm(initialPatient);
      setMessage(`Patient account created. OTP: ${data.devOtp}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to add patient');
    }
  };

  const updateStatus = async (id, status) => {
    const { data } = await api.patch(`/doctors/appointments/${id}`, { status });
    setAppointments((prev) => prev.map((a) => (a._id === id ? data : a)));
  };

  return (
    <div className="container">
      <section className="page-header compact">
        <div>
          <p className="eyebrow">Admin control center</p>
          <h1>Hospital operations</h1>
          <p>Only the seeded admin account can access this area.</p>
        </div>
      </section>

      {message && <p className="notice success">{message}</p>}
      {error && <p className="notice error">{error}</p>}

      <div className="card-grid admin-grid">
        <div className="card">
          <h2>Add doctor</h2>
          <form onSubmit={createDoctor}>
            <div className="two-column">
              <div className="form-group"><label>Name</label><input value={doctorForm.name} onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })} required /></div>
              <div className="form-group"><label>Email</label><input type="email" value={doctorForm.email} onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })} required /></div>
              <div className="form-group"><label>Password</label><input type="password" value={doctorForm.password} onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })} required /></div>
              <div className="form-group"><label>Category</label><input value={doctorForm.specialization} onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })} required /></div>
            </div>
            <div className="form-group"><label>Availability</label><input value={doctorForm.availability} onChange={(e) => setDoctorForm({ ...doctorForm, availability: e.target.value })} /></div>
            <button className="btn" type="submit">Add doctor</button>
          </form>
        </div>

        <div className="card">
          <h2>Add patient</h2>
          <form onSubmit={createPatient}>
            <div className="two-column">
              <div className="form-group"><label>Name</label><input value={patientForm.name} onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })} required /></div>
              <div className="form-group"><label>Email</label><input type="email" value={patientForm.email} onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })} required /></div>
              <div className="form-group"><label>Password</label><input type="password" value={patientForm.password} onChange={(e) => setPatientForm({ ...patientForm, password: e.target.value })} required /></div>
              <div className="form-group"><label>Age</label><input type="number" value={patientForm.age} onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })} required /></div>
              <div className="form-group"><label>Gender</label><select value={patientForm.gender} onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
            </div>
            <div className="form-group"><label>Medical history</label><textarea rows="2" value={patientForm.medicalHistory} onChange={(e) => setPatientForm({ ...patientForm, medicalHistory: e.target.value })} /></div>
            <button className="btn" type="submit">Add patient</button>
          </form>
        </div>
      </div>

      <div className="card-grid list-grid">
        <div className="card">
          <h2>Doctor categories</h2>
          <div className="badge-row">{categories.map((category) => <span className="badge" key={category}>{category}</span>)}</div>
          {doctors.map((d) => <p key={d._id}>{d.userId?.name} - {d.specialization}</p>)}
        </div>
        <div className="card">
          <h2>Patients</h2>
          {patients.map((p) => <p key={p._id}>{p.userId?.name} - {p.gender}, {p.age} {p.userId?.isEmailVerified ? '' : '(OTP pending)'}</p>)}
        </div>
      </div>

      <div className="card table-card">
        <h2>Appointments</h2>
        <table className="table">
          <thead><tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a._id}>
                <td>{a.patientId?.userId?.name || 'Patient'}</td>
                <td>{a.doctorId?.userId?.name || 'Doctor'}<br /><small>{a.doctorId?.specialization}</small></td>
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
    </div>
  );
};

export default AdminPage;