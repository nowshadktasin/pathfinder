import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Save, User, AlertCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

import { useNavigate } from 'react-router-dom';

const SCORE_RULES = {
    gpa:   { min: 0,   max: 4.0,  label: 'GPA',   hint: '0 – 4.0' },
    ielts: { min: 0,   max: 9,    label: 'IELTS',  hint: '0 – 9'   },
    toefl: { min: 0,   max: 120,  label: 'TOEFL',  hint: '0 – 120' },
    sat:   { min: 400, max: 1600, label: 'SAT',    hint: '400 – 1600' },
};

const validateField = (name, value) => {
    const rule = SCORE_RULES[name];
    if (!rule || value === '' || value === null || value === undefined) return '';
    const num = Number(value);
    if (isNaN(num)) return `${rule.label} must be a number`;
    if (num < rule.min || num > rule.max) return `${rule.label} must be ${rule.hint}`;
    return '';
};

const Profile = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        // Student fields
        gpa: '',
        sat: '',
        toefl: '',
        ielts: '',
        maxTuition: '',
        desiredMajor: '',
        preferredDestinations: '',
        careerGoals: '',
        campusPreferences: [],
        // Consultant fields
        specialization: '',
        experienceYears: '',
        bio: '',
        skills: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.profile?.firstName || '',
                lastName: user.profile?.lastName || '',
                // Student
                gpa: user.academicHistory?.gpa || '',
                sat: user.testScores?.sat || '',
                toefl: user.testScores?.toefl || '',
                ielts: user.testScores?.ielts || '',
                maxTuition: user.budget?.maxTuition || '',
                desiredMajor: user.interests?.desiredMajor?.join(', ') || '',
                preferredDestinations: user.interests?.preferredStudyDestinations?.join(', ') || '',
                careerGoals: user.interests?.careerGoals || '',
                campusPreferences: user.interests?.campusPreferences || [],
                // Consultant
                specialization: user.consultantProfile?.specialization || '',
                experienceYears: user.consultantProfile?.experienceYears || '',
                bio: user.consultantProfile?.bio || '',
                skills: user.consultantProfile?.skills?.join(', ') || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        if (name === 'campusPreferences') {
            const currentPrefs = formData.campusPreferences;
            if (checked) {
                setFormData({ ...formData, campusPreferences: [...currentPrefs, value] });
            } else {
                setFormData({ ...formData, campusPreferences: currentPrefs.filter(p => p !== value) });
            }
        } else {
            setFormData({ ...formData, [name]: value });
            // Re-validate live only if this field already has a visible error
            if (errors[name] !== undefined) {
                setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
            }
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        if (SCORE_RULES[name]) {
            const msg = validateField(name, value);
            setErrors(prev => ({ ...prev, [name]: msg }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (user.role !== 'consultant') {
            const newErrors = Object.fromEntries(
                Object.keys(SCORE_RULES).map(field => [field, validateField(field, formData[field])])
            );
            setErrors(newErrors);
            if (Object.values(newErrors).some(Boolean)) return;
        }

        setLoading(true);

        const updatePayload = {
            profile: {
                firstName: formData.firstName,
                lastName: formData.lastName
            }
        };

        if (user.role === 'consultant') {
            updatePayload.consultantProfile = {
                specialization: formData.specialization,
                experienceYears: parseInt(formData.experienceYears) || 0,
                bio: formData.bio,
                skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
            };
        } else {
            updatePayload.academicHistory = {
                gpa: parseFloat(formData.gpa) || undefined
            };
            updatePayload.testScores = {
                sat: parseInt(formData.sat) || undefined,
                toefl: parseInt(formData.toefl) || undefined,
                ielts: parseFloat(formData.ielts) || undefined
            };
            updatePayload.budget = {
                maxTuition: parseInt(formData.maxTuition) || undefined
            };
            updatePayload.interests = {
                desiredMajor: formData.desiredMajor.split(',').map(s => s.trim()).filter(Boolean),
                preferredStudyDestinations: formData.preferredDestinations.split(',').map(s => s.trim()).filter(Boolean),
                careerGoals: formData.careerGoals,
                campusPreferences: formData.campusPreferences
            };
        }

        try {
            updateUser(updatePayload);
            addToast('Profile updated successfully!', 'success');
            setTimeout(() => {
                navigate(user.role === 'consultant' ? '/consultant/dashboard' : '/dashboard');
            }, 1000);
        } catch (error) {
            addToast('Failed to update profile.', 'error');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">

            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 text-slate-900 dark:text-[#e4e6eb]">
                <User className="text-blue-600 dark:text-blue-400" /> My Profile
            </h1>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-[#242526] rounded-xl shadow-sm border border-slate-200 dark:border-[#3e4042] p-6 space-y-8 transition-colors duration-300">
                {/* Personal Info */}
                <div>
                    <h2 className="text-xl font-bold mb-4 border-b border-slate-200 dark:border-[#3e4042] pb-2 text-slate-900 dark:text-[#e4e6eb]">Personal Information</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-[#b0b3b8] mb-1">First Name</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="input-field dark:bg-[#3a3b3c] dark:border-[#3e4042] dark:text-[#e4e6eb] dark:placeholder-[#b0b3b8]" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-[#b0b3b8] mb-1">Last Name</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="input-field dark:bg-[#3a3b3c] dark:border-[#3e4042] dark:text-[#e4e6eb] dark:placeholder-[#b0b3b8]" required />
                        </div>
                    </div>
                </div>

                {user.role === 'consultant' ? (
                    /* Consultant Specific Fields */
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <h2 className="text-xl font-bold mb-4 border-b border-slate-200 dark:border-[#3e4042] pb-2 text-slate-900 dark:text-[#e4e6eb]">Professional Details</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-[#b0b3b8] mb-1">Specialization</label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    className="input-field dark:bg-[#3a3b3c] dark:border-[#3e4042] dark:text-[#e4e6eb] dark:placeholder-[#b0b3b8]"
                                    placeholder="e.g. Ivy League Admissions, STEM"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-[#b0b3b8] mb-1">Years of Experience</label>
                                <input
                                    type="number"
                                    name="experienceYears"
                                    value={formData.experienceYears}
                                    onChange={handleChange}
                                    className="input-field dark:bg-[#3a3b3c] dark:border-[#3e4042] dark:text-[#e4e6eb] dark:placeholder-[#b0b3b8]"
                                    placeholder="e.g. 5"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-[#b0b3b8] mb-1">Core Skills (comma separated)</label>
                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                className="input-field dark:bg-[#3a3b3c] dark:border-[#3e4042] dark:text-[#e4e6eb] dark:placeholder-[#b0b3b8]"
                                placeholder="e.g. Essay Review, Visa Guidance, Career Coaching"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-[#b0b3b8] mb-1">Professional Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                className="input-field h-32 dark:bg-[#3a3b3c] dark:border-[#3e4042] dark:text-[#e4e6eb] dark:placeholder-[#b0b3b8]"
                                placeholder="Tell students about your background and how you can help them..."
                            />
                        </div>
                    </div>
                ) : (
                    /* Student Specific Fields */
                    <div className="space-y-8 animate-in fade-in duration-500">
                        {/* Academic Info */}
                        <div>
                            <h2 className="text-xl font-bold mb-4 border-b border-slate-200 dark:border-[#3e4042] pb-2 text-slate-900 dark:text-[#e4e6eb]">Academic & Test Scores</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-[#b0b3b8] mb-1">
                                        GPA <span className="text-slate-400 dark:text-[#5a5b70] font-normal">(0 – 4.0)</span>
                                    </label>
                                    <input
                                        type="number" step="0.01" name="gpa"
                                        value={formData.gpa}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`input-field dark:bg-[#3a3b3c] dark:text-[#e4e6eb] dark:placeholder-[#b0b3b8] ${errors.gpa ? 'border-red-400 dark:border-red-500 focus:ring-red-400' : 'dark:border-[#3e4042]'}`}
                                        placeholder="e.g. 3.8"
                                    />
                                    {errors.gpa && (
                                        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
                                            <AlertCircle size={11} className="shrink-0" /> {errors.gpa}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-[#b0b3b8] mb-1">
                                        SAT <span className="text-slate-400 dark:text-[#5a5b70] font-normal">(400 – 1600)</span>
                                    </label>
                                    <input
                                        type="number" name="sat"
                                        value={formData.sat}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`input-field dark:bg-[#3a3b3c] dark:text-[#e4e6eb] dark:placeholder-[#b0b3b8] ${errors.sat ? 'border-red-400 dark:border-red-500 focus:ring-red-400' : 'dark:border-[#3e4042]'}`}
                                        placeholder="e.g. 1400"
                                    />
                                    {errors.sat && (
                                        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
                                            <AlertCircle size={11} className="shrink-0" /> {errors.sat}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-[#b0b3b8] mb-1">
                                        TOEFL <span className="text-slate-400 dark:text-[#5a5b70] font-normal">(0 – 120)</span>
                                    </label>
                                    <input
                                        type="number" name="toefl"
                                        value={formData.toefl}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`input-field dark:bg-[#3a3b3c] dark:text-[#e4e6eb] dark:placeholder-[#b0b3b8] ${errors.toefl ? 'border-red-400 dark:border-red-500 focus:ring-red-400' : 'dark:border-[#3e4042]'}`}
                                        placeholder="e.g. 100"
                                    />
                                    {errors.toefl && (
                                        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
                                            <AlertCircle size={11} className="shrink-0" /> {errors.toefl}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-[#b0b3b8] mb-1">
                                        IELTS <span className="text-slate-400 dark:text-[#5a5b70] font-normal">(0 – 9)</span>
                                    </label>
                                    <input
                                        type="number" step="0.5" name="ielts"
                                        value={formData.ielts}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`input-field dark:bg-[#3a3b3c] dark:text-[#e4e6eb] dark:placeholder-[#b0b3b8] ${errors.ielts ? 'border-red-400 dark:border-red-500 focus:ring-red-400' : 'dark:border-[#3e4042]'}`}
                                        placeholder="e.g. 7.5"
                                    />
                                    {errors.ielts && (
                                        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
                                            <AlertCircle size={11} className="shrink-0" /> {errors.ielts}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Preferences */}
                        <div>
                            <h2 className="text-xl font-bold mb-4 border-b border-slate-200 dark:border-[#3e4042] pb-2 text-slate-900 dark:text-[#e4e6eb]">Preferences & Budget</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-[#b0b3b8] mb-1">Max Annual Tuition (USD)</label>
                                    <input type="number" name="maxTuition" value={formData.maxTuition} onChange={handleChange} className="input-field dark:bg-[#3a3b3c] dark:border-[#3e4042] dark:text-[#e4e6eb] dark:placeholder-[#b0b3b8]" placeholder="e.g. 50000" />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-[#b0b3b8] mb-1">Desired Majors (comma separated)</label>
                                        <input type="text" name="desiredMajor" value={formData.desiredMajor} onChange={handleChange} className="input-field dark:bg-[#3a3b3c] dark:border-[#3e4042] dark:text-[#e4e6eb] dark:placeholder-[#b0b3b8]" placeholder="e.g. Computer Science, Engineering" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-[#b0b3b8] mb-1">Preferred Destinations (comma separated)</label>
                                        <input type="text" name="preferredDestinations" value={formData.preferredDestinations} onChange={handleChange} className="input-field dark:bg-[#3a3b3c] dark:border-[#3e4042] dark:text-[#e4e6eb] dark:placeholder-[#b0b3b8]" placeholder="e.g. USA, UK, Canada" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-[#b0b3b8] mb-1">Career Goals</label>
                                    <textarea
                                        name="careerGoals"
                                        value={formData.careerGoals}
                                        onChange={handleChange}
                                        className="input-field h-24 dark:bg-[#3a3b3c] dark:border-[#3e4042] dark:text-[#e4e6eb] dark:placeholder-[#b0b3b8]"
                                        placeholder="Describe your career aspirations..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-[#b0b3b8] mb-2">Campus Preferences</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {['Urban', 'Suburban', 'Rural', 'Large', 'Medium', 'Small'].map(pref => (
                                            <label key={pref} className="flex items-center gap-2 text-sm text-slate-600 dark:text-[#b0b3b8] cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="campusPreferences"
                                                    value={pref}
                                                    checked={formData.campusPreferences.includes(pref)}
                                                    onChange={handleChange}
                                                    className="rounded border-slate-300 dark:border-[#3e4042] text-blue-600 focus:ring-blue-500 dark:bg-[#3a3b3c]"
                                                />
                                                {pref}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                        <Save size={18} />
                        {loading ? 'Saving...' : 'Save Profile'}
                    </button>
                </div>
            </form >
        </div >
    );
};

export default Profile;
