"use client";

import { useState } from "react";
import { Patient, updatePatient } from "@/lib/patients";
import { Appointment, createAppointment, updateAppointment, deleteAppointment } from "@/lib/appointments";
import { Prescription, createPrescription, updatePrescription, deletePrescription } from "@/lib/prescriptions";
import { Repeat } from "@/lib/patients";
import { Medication, Dosage } from "@/lib/medications";

type Props = {
    patient: Patient;
    medications?: Medication[];
    dosages?: Dosage[];
};

const REPEAT_OPTIONS: Repeat[] = ["daily", "weekly", "monthly"];

const emptyAppointment = { provider: "", datetime: "", repeat: "daily" as Repeat };
const emptyPrescription = { medication_id: "", dosage_id: "", quantity: 1, refill_on: "", refill_schedule: "daily" as Repeat };

export const PatientEditForm = ({ patient, medications = [], dosages = [] }: Props) => {
    // --- Personal Info ---
    const [name, setName] = useState(patient.name);
    const [email, setEmail] = useState(patient.email);

    const handleSavePatient = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        await updatePatient(patient.id, { name, email });
    };

    // --- Appointments ---
    const [appointments, setAppointments] = useState<Appointment[]>(patient.appointments ?? []);
    const [editingAppt, setEditingAppt] = useState<string | null>(null);
    const [apptDraft, setApptDraft] = useState<typeof emptyAppointment>(emptyAppointment);
    const [showNewAppt, setShowNewAppt] = useState(false);
    const [newAppt, setNewAppt] = useState(emptyAppointment);

    const startEditAppt = (a: Appointment) => {
        setEditingAppt(a.id);
        setApptDraft({
            provider: a.provider,
            datetime: new Date(a.datetime).toISOString().slice(0, 16),
            repeat: a.repeat,
        });
    };

    const handleSaveAppt = async (id: string) => {
        const updated = await updateAppointment(id, apptDraft);
        setAppointments(prev => prev.map(a => a.id === id ? updated : a));
        setEditingAppt(null);
    };

    const handleDeleteAppt = async (id: string) => {
        await deleteAppointment(id);
        setAppointments(prev => prev.filter(a => a.id !== id));
    };

    const handleCreateAppt = async () => {
        const created = await createAppointment(patient.id, newAppt);
        setAppointments(prev => [...prev, created]);
        setShowNewAppt(false);
        setNewAppt(emptyAppointment);
    };

    // --- Prescriptions ---
    const [prescriptions, setPrescriptions] = useState<Prescription[]>(patient.prescriptions ?? []);
    const [editingRx, setEditingRx] = useState<string | null>(null);
    const [rxDraft, setRxDraft] = useState({ medication_id: "", dosage_id: "", quantity: 1, refill_on: "", refill_schedule: "daily" as Repeat });
    const [showNewRx, setShowNewRx] = useState(false);
    const [newRx, setNewRx] = useState(emptyPrescription);

    const startEditRx = (p: Prescription) => {
        setEditingRx(p.id);
        setRxDraft({ medication_id: String(p.medication.id), dosage_id: String(p.dosage.id), quantity: p.quantity, refill_on: p.refill_on, refill_schedule: p.refill_schedule });
    };

    const handleSaveRx = async (id: string) => {
        const updated = await updatePrescription(id, {
            ...rxDraft,
            medication_id: Number(rxDraft.medication_id),
            dosage_id: Number(rxDraft.dosage_id),
        });
        setPrescriptions(prev => prev.map(p => p.id === id ? updated : p));
        setEditingRx(null);
    };

    const handleDeleteRx = async (id: string) => {
        await deletePrescription(id);
        setPrescriptions(prev => prev.filter(p => p.id !== id));
    };

    const handleCreateRx = async () => {
        const created = await createPrescription(patient.id, {
            ...newRx,
            medication_id: Number(newRx.medication_id),
            dosage_id: Number(newRx.dosage_id),
        });
        setPrescriptions(prev => [...prev, created]);
        setShowNewRx(false);
        setNewRx(emptyPrescription);
    };

    return (
        <div className="flex flex-col gap-10">

            {/* Personal Info */}
            <section>
                <h2 className="subheading mb-4">Personal Information</h2>
                <form onSubmit={handleSavePatient} className="flex gap-4 flex-wrap items-end">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted uppercase tracking-wide">Name</span>
                        <input className="border border-border p-2" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted uppercase tracking-wide">Email</span>
                        <input className="min-w-80 border border-border p-2" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
                    </div>
                    <button type="submit" className="btn-primary">Save</button>
                </form>
            </section>

            {/* Appointments */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="subheading">Appointments</h2>
                    <button className="btn-primary text-sm" onClick={() => setShowNewAppt(true)}>+ New</button>
                </div>

                {showNewAppt && (
                    <div className="border border-border p-4 mb-4 flex gap-4 flex-wrap items-end">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted uppercase tracking-wide">Provider</span>
                            <input className="border border-border p-2" value={newAppt.provider} onChange={e => setNewAppt(p => ({ ...p, provider: e.target.value }))} placeholder="Provider" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted uppercase tracking-wide">Date & Time</span>
                            <input className="border border-border p-2" type="datetime-local" value={newAppt.datetime} onChange={e => setNewAppt(p => ({ ...p, datetime: e.target.value }))} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted uppercase tracking-wide">Repeat</span>
                            <select className="border border-border p-2" value={newAppt.repeat} onChange={e => setNewAppt(p => ({ ...p, repeat: e.target.value as Repeat }))}>
                                {REPEAT_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button className="btn-primary text-sm" onClick={handleCreateAppt}>Create</button>
                            <button className="btn-secondary text-sm" onClick={() => setShowNewAppt(false)}>Cancel</button>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    {appointments.map(a => (
                        <div key={a.id} className="border border-border p-4">
                            {editingAppt === a.id ? (
                                <div className="flex gap-4 flex-wrap items-end">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-muted uppercase tracking-wide">Provider</span>
                                        <input className="border border-border p-2" value={apptDraft.provider} onChange={e => setApptDraft(p => ({ ...p, provider: e.target.value }))} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-muted uppercase tracking-wide">Date & Time</span>
                                        <input className="border border-border p-2" type="datetime-local" value={apptDraft.datetime} onChange={e => setApptDraft(p => ({ ...p, datetime: e.target.value }))} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-muted uppercase tracking-wide">Repeat</span>
                                        <select className="border border-border p-2" value={apptDraft.repeat} onChange={e => setApptDraft(p => ({ ...p, repeat: e.target.value as Repeat }))}>
                                            {REPEAT_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="btn-primary text-sm" onClick={() => handleSaveAppt(a.id)}>Save</button>
                                        <button className="btn-secondary text-sm" onClick={() => setEditingAppt(null)}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-6">
                                        <span><span className="text-muted text-xs">Provider </span>{a.provider}</span>
                                        <span><span className="text-muted text-xs">Date </span>{new Date(a.datetime).toLocaleString()}</span>
                                        <span><span className="text-muted text-xs">Repeat </span>{a.repeat}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="btn-secondary text-sm" onClick={() => startEditAppt(a)}>Edit</button>
                                        <button className="btn-danger text-sm" onClick={() => handleDeleteAppt(a.id)}>Delete</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Prescriptions */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="subheading">Prescriptions</h2>
                    <button className="btn-primary text-sm" onClick={() => setShowNewRx(true)}>+ New</button>
                </div>

                {showNewRx && (
                    <div className="border border-border p-4 mb-4 flex gap-4 flex-wrap items-end">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted uppercase tracking-wide">Medication</span>
                            <select className="border border-border p-2" value={newRx.medication_id} onChange={e => setNewRx(p => ({ ...p, medication_id: e.target.value }))}>
                                <option value="">Select medication</option>
                                {medications.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted uppercase tracking-wide">Dosage</span>
                            <select className="border border-border p-2" value={newRx.dosage_id} onChange={e => setNewRx(p => ({ ...p, dosage_id: e.target.value }))}>
                                <option value="">Select dosage</option>
                                {dosages.map(d => <option key={d.id} value={d.id}>{d.value}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted uppercase tracking-wide">Quantity</span>
                            <input className="border border-border p-2 w-24" type="number" min={1} value={newRx.quantity} onChange={e => setNewRx(p => ({ ...p, quantity: Number(e.target.value) }))} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted uppercase tracking-wide">Refill On</span>
                            <input className="border border-border p-2" type="date" value={newRx.refill_on} onChange={e => setNewRx(p => ({ ...p, refill_on: e.target.value }))} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted uppercase tracking-wide">Refill Schedule</span>
                            <select className="border border-border p-2" value={newRx.refill_schedule} onChange={e => setNewRx(p => ({ ...p, refill_schedule: e.target.value as Repeat }))}>
                                {REPEAT_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button className="btn-primary text-sm" onClick={handleCreateRx}>Create</button>
                            <button className="btn-secondary text-sm" onClick={() => setShowNewRx(false)}>Cancel</button>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    {prescriptions.map(p => (
                        <div key={p.id} className="border border-border p-4">
                            {editingRx === p.id ? (
                                <div className="flex gap-4 flex-wrap items-end">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-muted uppercase tracking-wide">Medication</span>
                                        <select className="border border-border p-2" value={rxDraft.medication_id} onChange={e => setRxDraft(d => ({ ...d, medication_id: e.target.value }))}>
                                            <option value="">Select medication</option>
                                            {medications.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-muted uppercase tracking-wide">Dosage</span>
                                        <select className="border border-border p-2" value={rxDraft.dosage_id} onChange={e => setRxDraft(d => ({ ...d, dosage_id: e.target.value }))}>
                                            <option value="">Select dosage</option>
                                            {dosages.map(d => <option key={d.id} value={d.id}>{d.value}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-muted uppercase tracking-wide">Quantity</span>
                                        <input className="border border-border p-2 w-24" type="number" min={1} value={rxDraft.quantity} onChange={e => setRxDraft(d => ({ ...d, quantity: Number(e.target.value) }))} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-muted uppercase tracking-wide">Refill On</span>
                                        <input className="border border-border p-2" type="date" value={rxDraft.refill_on} onChange={e => setRxDraft(d => ({ ...d, refill_on: e.target.value }))} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-muted uppercase tracking-wide">Refill Schedule</span>
                                        <select className="border border-border p-2" value={rxDraft.refill_schedule} onChange={e => setRxDraft(d => ({ ...d, refill_schedule: e.target.value as Repeat }))}>
                                            {REPEAT_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="btn-primary text-sm" onClick={() => handleSaveRx(p.id)}>Save</button>
                                        <button className="btn-secondary text-sm" onClick={() => setEditingRx(null)}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-6">
                                        <span><span className="text-muted text-xs">Medication </span>{p.medication.name}</span>
                                        <span><span className="text-muted text-xs">Dosage </span>{p.dosage.value}</span>
                                        <span><span className="text-muted text-xs">Qty </span>{p.quantity}</span>
                                        <span><span className="text-muted text-xs">Refill </span>{p.refill_on} · {p.refill_schedule}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="btn-secondary text-sm" onClick={() => startEditRx(p)}>Edit</button>
                                        <button className="btn-danger text-sm" onClick={() => handleDeleteRx(p.id)}>Delete</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
