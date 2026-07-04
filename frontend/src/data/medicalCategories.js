export const medicalCategories = [
  {
    name: 'Cardiology',
    subtitle: 'Heart Diseases',
    summary: 'The heart pumps blood throughout the body. Problems can reduce blood flow or damage the heart.',
    illnesses: ['High Blood Pressure', 'Heart Attack', 'Heart Failure', 'Arrhythmia', 'Coronary Artery Disease'],
    symptoms: ['Chest pain', 'Shortness of breath', 'Palpitations', 'Dizziness'],
    doctor: { name: 'Dr. Arjun Mehta', title: 'Senior Cardiologist', experience: '12 years', room: 'Heart Care Unit' }
  },
  {
    name: 'Neurology',
    subtitle: 'Brain and Nervous System',
    summary: 'Deals with the brain, spinal cord, and nerves.',
    illnesses: ['Stroke', 'Epilepsy', 'Parkinson\'s Disease', 'Alzheimer\'s Disease', 'Migraine'],
    symptoms: ['Headache', 'Weakness', 'Numbness', 'Memory loss', 'Seizures'],
    doctor: { name: 'Dr. Kavya Raman', title: 'Consultant Neurologist', experience: '10 years', room: 'Neuro Clinic' }
  },
  {
    name: 'Pulmonology',
    subtitle: 'Lungs',
    summary: 'Treats breathing and lung diseases.',
    illnesses: ['Asthma', 'Chronic Obstructive Pulmonary Disease', 'Pneumonia', 'Tuberculosis', 'Lung Cancer'],
    symptoms: ['Cough', 'Fever', 'Breathlessness', 'Chest pain'],
    doctor: { name: 'Dr. Sara Thomas', title: 'Pulmonologist', experience: '9 years', room: 'Respiratory Care' }
  },
  {
    name: 'Gastroenterology',
    subtitle: 'Digestive System',
    summary: 'Treats the stomach and digestive organs.',
    illnesses: ['Gastritis', 'Peptic Ulcer Disease', 'Gastroesophageal Reflux Disease', 'Hepatitis', 'Cirrhosis'],
    symptoms: ['Abdominal pain', 'Vomiting', 'Diarrhea', 'Constipation', 'Jaundice'],
    doctor: { name: 'Dr. Nikhil Varma', title: 'Digestive Disease Specialist', experience: '11 years', room: 'GI Clinic' }
  },
  {
    name: 'Nephrology',
    subtitle: 'Kidneys',
    summary: 'Treats kidney-related illnesses.',
    illnesses: ['Kidney Stones', 'Chronic Kidney Disease', 'Acute Kidney Injury', 'Urinary Tract Infection'],
    symptoms: ['Pain while urinating', 'Swelling', 'Blood in urine', 'Reduced urine output'],
    doctor: { name: 'Dr. Farah Khan', title: 'Nephrologist', experience: '8 years', room: 'Renal Care' }
  },
  {
    name: 'Endocrinology',
    subtitle: 'Hormones',
    summary: 'Treats hormone disorders.',
    illnesses: ['Type 1 Diabetes', 'Type 2 Diabetes', 'Hypothyroidism', 'Hyperthyroidism'],
    symptoms: ['Weight changes', 'Fatigue', 'Increased thirst', 'Frequent urination'],
    doctor: { name: 'Dr. Meera Iyer', title: 'Endocrinologist', experience: '10 years', room: 'Diabetes and Hormone Clinic' }
  },
  {
    name: 'Dermatology',
    subtitle: 'Skin',
    summary: 'Treats skin, hair, and nails.',
    illnesses: ['Eczema', 'Psoriasis', 'Acne', 'Fungal Infection'],
    symptoms: ['Itching', 'Rashes', 'Redness', 'Skin peeling'],
    doctor: { name: 'Dr. Rohan Das', title: 'Dermatologist', experience: '7 years', room: 'Skin Clinic' }
  },
  {
    name: 'Orthopedics',
    subtitle: 'Bones and Joints',
    summary: 'Treats bones, muscles, and joints.',
    illnesses: ['Bone fractures', 'Osteoporosis', 'Osteoarthritis', 'Rheumatoid Arthritis'],
    symptoms: ['Pain', 'Swelling', 'Difficulty walking', 'Stiffness'],
    doctor: { name: 'Dr. Prakash Nair', title: 'Orthopedic Surgeon', experience: '13 years', room: 'Bone and Joint Center' }
  },
  {
    name: 'Ophthalmology',
    subtitle: 'Eyes',
    summary: 'Treats eye diseases.',
    illnesses: ['Cataract', 'Glaucoma', 'Conjunctivitis', 'Diabetic Retinopathy'],
    symptoms: ['Blurred vision', 'Eye pain', 'Redness'],
    doctor: { name: 'Dr. Anita George', title: 'Ophthalmologist', experience: '9 years', room: 'Eye Care Unit' }
  },
  {
    name: 'ENT',
    subtitle: 'Ear, Nose and Throat',
    summary: 'Treats disorders of the ears, nose, and throat.',
    illnesses: ['Ear infection', 'Sinusitis', 'Tonsillitis', 'Hearing loss', 'Nosebleeds'],
    symptoms: ['Ear pain', 'Sore throat', 'Blocked nose'],
    doctor: { name: 'Dr. Sameer Ali', title: 'ENT Specialist', experience: '8 years', room: 'ENT Clinic' }
  },
  {
    name: 'Gynecology and Obstetrics',
    subtitle: "Women's Health",
    summary: 'Treats women\'s reproductive health and pregnancy.',
    illnesses: ['Polycystic Ovary Syndrome', 'Uterine fibroids', 'Endometriosis', 'Pregnancy complications', 'Menstrual disorders'],
    symptoms: ['Pelvic pain', 'Irregular periods', 'Pregnancy concerns'],
    doctor: { name: 'Dr. Leena Joseph', title: 'Gynecologist and Obstetrician', experience: '14 years', room: 'Women\'s Health Center' }
  },
  {
    name: 'Pediatrics',
    subtitle: 'Children',
    summary: 'Treats infants and children.',
    illnesses: ['Common cold', 'Fever', 'Pneumonia', 'Asthma', 'Childhood infections', 'Growth disorders'],
    symptoms: ['Fever', 'Cough', 'Breathing issues', 'Growth concerns'],
    doctor: { name: 'Dr. Priya Menon', title: 'Pediatrician', experience: '12 years', room: 'Child Care Unit' }
  },
  {
    name: 'Oncology',
    subtitle: 'Cancer',
    summary: 'Treats cancers using surgery, chemotherapy, radiation therapy, and immunotherapy.',
    illnesses: ['Breast cancer', 'Lung cancer', 'Blood cancer', 'Colon cancer', 'Brain tumor'],
    symptoms: ['Unexplained weight loss', 'Lumps', 'Persistent pain', 'Unusual bleeding'],
    doctor: { name: 'Dr. Vikram Sethi', title: 'Medical Oncologist', experience: '15 years', room: 'Cancer Care Center' }
  },
  {
    name: 'Psychiatry',
    subtitle: 'Mental Health',
    summary: 'Treats mental and emotional disorders.',
    illnesses: ['Depression', 'Anxiety Disorder', 'Bipolar Disorder', 'Schizophrenia'],
    symptoms: ['Persistent sadness', 'Anxiety', 'Mood changes', 'Hallucinations'],
    doctor: { name: 'Dr. Aisha Rahman', title: 'Psychiatrist', experience: '10 years', room: 'Mind Care Clinic' }
  },
  {
    name: 'Infectious Diseases',
    subtitle: 'Infections',
    summary: 'Treats infections caused by bacteria, viruses, fungi, and parasites.',
    illnesses: ['COVID-19', 'Dengue Fever', 'Malaria', 'Typhoid Fever', 'Influenza'],
    symptoms: ['Fever', 'Body pain', 'Fatigue', 'Cough', 'Rash'],
    doctor: { name: 'Dr. Manoj Pillai', title: 'Infectious Disease Consultant', experience: '11 years', room: 'Infection Control Unit' }
  },
  {
    name: 'Emergency Medicine',
    subtitle: 'Critical Care',
    summary: 'Handles life-threatening emergencies.',
    illnesses: ['Heart attack', 'Stroke', 'Severe bleeding', 'Poisoning', 'Major accidents', 'Burns'],
    symptoms: ['Severe pain', 'Loss of consciousness', 'Heavy bleeding', 'Breathing trouble'],
    doctor: { name: 'Dr. Neha Kapoor', title: 'Emergency Physician', experience: '9 years', room: 'Emergency Bay' }
  },
  {
    name: 'General Medicine',
    subtitle: 'Common Illnesses',
    summary: 'The first department for diagnosing common illnesses.',
    illnesses: ['Fever', 'Cold', 'Cough', 'Viral infections', 'Fatigue', 'Headache', 'Body pain'],
    symptoms: ['Fever', 'Cold', 'Cough', 'Fatigue', 'Headache'],
    doctor: { name: 'Dr. Hari Krishnan', title: 'General Physician', experience: '16 years', room: 'General OPD' }
  }
];