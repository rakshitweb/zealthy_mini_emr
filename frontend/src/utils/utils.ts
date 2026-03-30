import { Appointment } from "@/lib/appointments";
import { Repeat } from "@/lib/patients";
import { Prescription } from "@/lib/prescriptions";

const getNextDate = (current: Date, repeat: Repeat) => {
  const next = new Date(current);
  if (repeat === "daily") next.setDate(next.getDate() + 1);
  else if (repeat === "weekly") next.setDate(next.getDate() + 7);
  else if (repeat === "monthly") next.setMonth(next.getMonth() + 1);
  else throw new Error("Invalid repeat");
  return next;
};

export const generateAppointmentSequence = (
  appointments: Appointment[],
  endDate: Date,
  page_size?: number,
) => {
  const results: {
    id: string;
    provider: string;
    repeat: Repeat;
    next_date: string;
  }[] = [];
  for (const event of appointments) {
    let current = new Date(event.latest_occurrence);
    let counter = 1;

    while (current <= endDate) {
      results.push({
        id: `${event.id}_${counter}`,
        provider: event.provider,
        repeat: event.repeat,
        next_date: new Date(current).toLocaleDateString(),
      });

      if (page_size && results.length >= page_size) {
        break;
      }

      current = getNextDate(current, event.repeat);
      counter += 1;
    }

    if (page_size && results.length >= page_size) {
      break;
    }
  }

  results.sort(
    (a, b) => new Date(a.next_date).getTime() - new Date(b.next_date).getTime(),
  );

  return results;
};

export const generatePrescriptionSequence = (
  presecription: Prescription[],
  endDate: Date,
  page_size?: number,
) => {
  const results: {
    id: string;
    next_date: string;
    medication: string;
    dosage: string;
    quantity: number;
    repeat: string;
  }[] = [];
  for (const event of presecription) {
    let current = new Date(event.latest_occurrence);
    let counter = 1;

    while (current <= endDate) {
      results.push({
        id: `${event.id}_${counter}`,
        medication: event.medication.name,
        dosage: event.dosage.value,
        repeat: event.refill_schedule,
        quantity: event.quantity,
        next_date: new Date(current).toLocaleDateString(),
      });

      if (page_size && results.length >= page_size) {
        break;
      }

      current = getNextDate(current, event.refill_schedule);
      counter += 1;
    }

    if (page_size && results.length >= page_size) {
      break;
    }
  }

  results.sort(
    (a, b) => new Date(a.next_date).getTime() - new Date(b.next_date).getTime(),
  );

  return results;
};
