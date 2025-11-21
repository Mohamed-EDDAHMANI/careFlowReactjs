import React, { useState } from 'react';
import { Calendar, Clock, User, X } from 'lucide-react';
import { useFetchDoctorAppointments } from '../hooks/useAppointments';
import type { Appointment } from '../features/appointment/appointmentTypes';

interface DoctorWeeklyCalendarProps {
  doctorId: string;
}

const DoctorWeeklyCalendar: React.FC<DoctorWeeklyCalendarProps> = ({ doctorId }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get current week dates
  const getWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const diff = currentDay === 0 ? -6 : 1 - currentDay; // Start from Monday
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    
    return { start: monday, end: sunday };
  };

  const weekDates = getWeekDates();

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  // React Query hook
  const { data, isLoading: loading } = useFetchDoctorAppointments(
    doctorId,
    {
      from: formatDate(weekDates.start),
      to: formatDate(weekDates.end),
      sort: 'start',
      order: 'asc',
      limit: 100,
    },
    isOpen // Only fetch when modal is open
  );

  const appointments = data?.data || [];

  // Group appointments by day
  const groupAppointmentsByDay = () => {
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const grouped: { [key: string]: Appointment[] } = {};
    
    days.forEach(day => {
      grouped[day] = [];
    });

    appointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.start);
      const dayIndex = appointmentDate.getDay();
      const dayName = days[dayIndex === 0 ? 6 : dayIndex - 1]; // Adjust for Monday start
      
      if (grouped[dayName]) {
        grouped[dayName].push(appointment);
      }
    });

    return grouped;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Prévu';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const groupedAppointments = isOpen ? groupAppointmentsByDay() : {};
  const currentDate = new Date();
  const monday = new Date(weekDates.start);

  return (
    <div className="relative">
      {/* Button to open calendar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
      >
        <Calendar className="w-5 h-5" />
        <span>Mon Calendrier Hebdomadaire</span>
      </button>

      {/* Calendar Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Calendrier Hebdomadaire</h2>
                <p className="text-blue-100 text-sm mt-1">
                  Du {formatDateDisplay(weekDates.start)} au {formatDateDisplay(weekDates.end)}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-blue-700 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Calendar Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Object.entries(groupedAppointments).map(([day, dayAppointments], index) => {
                    const dayDate = new Date(monday);
                    dayDate.setDate(monday.getDate() + index);
                    const isToday = dayDate.toDateString() === currentDate.toDateString();

                    return (
                      <div
                        key={day}
                        className={`border rounded-lg p-4 ${
                          isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="mb-3 pb-2 border-b">
                          <h3 className={`font-bold text-lg ${isToday ? 'text-blue-600' : 'text-gray-800'}`}>
                            {day}
                          </h3>
                          <p className="text-xs text-gray-500">{formatDateDisplay(dayDate)}</p>
                          <p className="text-xs font-medium text-gray-600 mt-1">
                            {dayAppointments.length} rendez-vous
                          </p>
                        </div>

                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {dayAppointments.length === 0 ? (
                            <p className="text-gray-400 text-sm italic text-center py-4">
                              Aucun rendez-vous
                            </p>
                          ) : (
                            dayAppointments.map((appointment) => (
                              <div
                                key={appointment._id}
                                className="bg-white border border-gray-200 rounded-md p-3 shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-start gap-2 mb-2">
                                  <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-gray-800">
                                      {formatTime(appointment.start)} - {formatTime(appointment.end)}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-2 mb-2">
                                  <User className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                                  <p className="text-sm text-gray-700 font-medium truncate">
                                    {appointment.patientId.name}
                                  </p>
                                </div>

                                {appointment.reason && (
                                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                    {appointment.reason}
                                  </p>
                                )}

                                <div className="flex items-center justify-between">
                                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(appointment.status)}`}>
                                    {getStatusLabel(appointment.status)}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {appointment.type}
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t p-4 bg-gray-50">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-100 border-2 border-blue-500"></span>
                    <span>Aujourd'hui</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                    <span>Prévu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-600"></span>
                    <span>Terminé</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-600"></span>
                    <span>Annulé</span>
                  </div>
                </div>
                <p className="font-medium">
                  Total: {appointments.length} rendez-vous cette semaine
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorWeeklyCalendar;
