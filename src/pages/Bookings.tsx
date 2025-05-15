import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Car, Users, Calendar, Clock, MapPin, PenTool as Tool, Search, Link2 } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { format, parseISO, addDays } from 'date-fns';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Vehicle, Room, VehicleBooking, RoomBooking } from '../types';

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Peugeot 3008',
    type: 'car',
    plate: 'AB-123-CD',
    seats: 5,
    status: 'available',
    location: 'Paris Office',
    lastMaintenance: '2024-02-15',
    nextMaintenance: '2024-08-15',
    mileage: 45000
  },
  {
    id: '2',
    name: 'Renault Trafic',
    type: 'van',
    plate: 'EF-456-GH',
    seats: 9,
    status: 'available',
    location: 'Lyon Office',
    lastMaintenance: '2024-01-20',
    nextMaintenance: '2024-07-20',
    mileage: 62000
  }
];

const mockRooms: Room[] = [
  {
    id: '1',
    name: 'Salle Eiffel',
    location: 'Paris Office - 3rd Floor',
    capacity: 12,
    features: ['projector', 'whiteboard', 'video-conference'],
    status: 'available'
  },
  {
    id: '2',
    name: 'Salle Lyon',
    location: 'Lyon Office - 2nd Floor',
    capacity: 8,
    features: ['tv-screen', 'whiteboard'],
    status: 'available'
  }
];

const Bookings = () => {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'rooms'>('vehicles');
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const [vehicleBooking, setVehicleBooking] = useState({
    vehicleId: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    purpose: ''
  });

  const [roomBooking, setRoomBooking] = useState({
    roomId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
    title: '',
    description: '',
    attendees: [] as string[],
    teamsLink: true
  });

  useEffect(() => {
    document.title = 'Bookings | Employee Portal';
  }, []);

  const handleVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle vehicle booking submission
    setShowVehicleForm(false);
  };

  const handleRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle room booking submission
    setShowRoomForm(false);
  };

  const renderEventContent = (eventInfo: any) => {
    const { event } = eventInfo;
    const isRoom = event.extendedProps.type === 'room';
    
    return (
      <div className="p-1">
        <div className="font-semibold text-sm">{eventInfo.timeText}</div>
        <div className="text-sm">
          {isRoom ? <Users size={14} className="inline me-1" /> : <Car size={14} className="inline me-1" />}
          {event.title}
        </div>
      </div>
    );
  };

  const handleDateSelect = (selectInfo: any) => {
    if (activeTab === 'rooms') {
      setRoomBooking({
        ...roomBooking,
        date: format(selectInfo.start, 'yyyy-MM-dd'),
        startTime: format(selectInfo.start, 'HH:mm'),
        endTime: format(selectInfo.end, 'HH:mm')
      });
      setShowRoomForm(true);
    } else {
      setVehicleBooking({
        ...vehicleBooking,
        startDate: format(selectInfo.start, 'yyyy-MM-dd'),
        endDate: format(selectInfo.end, 'yyyy-MM-dd')
      });
      setShowVehicleForm(true);
    }
  };

  const handleEventClick = (clickInfo: any) => {
    // Show event details in a modal or similar
    alert(`Event: ${clickInfo.event.title}`);
  };

  const filteredVehicles = mockVehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.plate.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = 
      selectedLocation === 'all' || 
      vehicle.location.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesLocation;
  });

  const filteredRooms = mockRooms.filter(room => {
    const matchesSearch = 
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = 
      selectedLocation === 'all' || 
      room.location.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesLocation;
  });

  return (
    <div className="container-fluid px-4">
      <PageHeader 
        title="Resource Bookings"
        subtitle="Book vehicles and meeting rooms"
      />

      <div className="card">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'vehicles' ? 'active' : ''}`}
                onClick={() => setActiveTab('vehicles')}
              >
                <Car size={18} className="me-2" />
                Vehicles
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'rooms' ? 'active' : ''}`}
                onClick={() => setActiveTab('rooms')}
              >
                <Users size={18} className="me-2" />
                Meeting Rooms
              </button>
            </li>
          </ul>
        </div>
        
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder={`Search ${activeTab === 'vehicles' ? 'vehicles' : 'rooms'}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="all">All Locations</option>
                <option value="paris">Paris Office</option>
                <option value="lyon">Lyon Office</option>
              </select>
            </div>
            <div className="col-md-2">
              <button 
                className="btn btn-orange w-100"
                onClick={() => activeTab === 'vehicles' ? setShowVehicleForm(true) : setShowRoomForm(true)}
              >
                Book {activeTab === 'vehicles' ? 'Vehicle' : 'Room'}
              </button>
            </div>
          </div>
          
          <div className="card mt-4">
            <div className="card-header">
              <h5 className="card-title mb-0">Calendar View</h5>
            </div>
            <div className="card-body">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                weekends={false}
                events={[
                  // Convert room bookings to calendar events
                  ...mockRooms.map(room => ({
                    title: `${room.name} - Team Meeting`,
                    start: '2024-03-20T10:00:00',
                    end: '2024-03-20T11:00:00',
                    backgroundColor: '#2196F3',
                    extendedProps: {
                      type: 'room',
                      teamsEnabled: room.teamsEnabled
                    }
                  })),
                  // Convert vehicle bookings to calendar events
                  ...mockVehicles.map(vehicle => ({
                    title: `${vehicle.name} - Business Trip`,
                    start: '2024-03-21',
                    end: '2024-03-22',
                    backgroundColor: '#FF7900',
                    extendedProps: {
                      type: 'vehicle'
                    }
                  }))
                ]}
                eventContent={renderEventContent}
                selectable={true}
                select={handleDateSelect}
                eventClick={handleEventClick}
              />
            </div>
          </div>

          {activeTab === 'vehicles' && (
            <>
              {showVehicleForm && (
                <div className="card mb-4 fade-in">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Book a Vehicle</h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleVehicleSubmit}>
                      <div className="row mb-3">
                        <div className="col-md-12">
                          <label className="form-label">Vehicle</label>
                          <select
                            className="form-select"
                            value={vehicleBooking.vehicleId}
                            onChange={(e) => setVehicleBooking({...vehicleBooking, vehicleId: e.target.value})}
                            required
                          >
                            <option value="">Select a vehicle...</option>
                            {mockVehicles.map(vehicle => (
                              <option key={vehicle.id} value={vehicle.id}>
                                {vehicle.name} - {vehicle.plate} ({vehicle.location})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label">Start Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={vehicleBooking.startDate}
                            onChange={(e) => setVehicleBooking({...vehicleBooking, startDate: e.target.value})}
                            min={format(new Date(), 'yyyy-MM-dd')}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">End Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={vehicleBooking.endDate}
                            onChange={(e) => setVehicleBooking({...vehicleBooking, endDate: e.target.value})}
                            min={vehicleBooking.startDate}
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Purpose</label>
                        <textarea
                          className="form-control"
                          value={vehicleBooking.purpose}
                          onChange={(e) => setVehicleBooking({...vehicleBooking, purpose: e.target.value})}
                          rows={3}
                          placeholder="Describe the purpose of your trip..."
                          required
                        ></textarea>
                      </div>

                      <div className="d-flex justify-content-end gap-2">
                        <button 
                          type="button" 
                          className="btn btn-light"
                          onClick={() => setShowVehicleForm(false)}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-orange">
                          Book Vehicle
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="row g-4">
                {filteredVehicles.map(vehicle => (
                  <div key={vehicle.id} className="col-md-6 col-lg-4">
                    <div className="card h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between mb-3">
                          <h5 className="card-title mb-0">{vehicle.name}</h5>
                          <span className={`badge ${
                            vehicle.status === 'available' ? 'bg-success' :
                            vehicle.status === 'maintenance' ? 'bg-warning' :
                            'bg-danger'
                          }`}>
                            {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                          </span>
                        </div>

                        <div className="mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <Car size={16} className="text-muted me-2" />
                            <span>{vehicle.plate}</span>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <Users size={16} className="text-muted me-2" />
                            <span>{vehicle.seats} seats</span>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <MapPin size={16} className="text-muted me-2" />
                            <span>{vehicle.location}</span>
                          </div>
                          <div className="d-flex align-items-center">
                            <Tool size={16} className="text-muted me-2" />
                            <span>Next maintenance: {format(parseISO(vehicle.nextMaintenance), 'MMM d, yyyy')}</span>
                          </div>
                        </div>

                        <button 
                          className="btn btn-orange w-100"
                          onClick={() => {
                            setVehicleBooking({...vehicleBooking, vehicleId: vehicle.id});
                            setShowVehicleForm(true);
                          }}
                          disabled={vehicle.status !== 'available'}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'rooms' && (
            <>
              {showRoomForm && (
                <div className="card mb-4 fade-in">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Book a Meeting Room</h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleRoomSubmit}>
                      <div className="row mb-3">
                        <div className="col-md-12">
                          <label className="form-label">Room</label>
                          <select
                            className="form-select"
                            value={roomBooking.roomId}
                            onChange={(e) => setRoomBooking({...roomBooking, roomId: e.target.value})}
                            required
                          >
                            <option value="">Select a room...</option>
                            {mockRooms.map(room => (
                              <option key={room.id} value={room.id}>
                                {room.name} - {room.location} (Capacity: {room.capacity})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-4">
                          <label className="form-label">Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={roomBooking.date}
                            onChange={(e) => setRoomBooking({...roomBooking, date: e.target.value})}
                            min={format(new Date(), 'yyyy-MM-dd')}
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Start Time</label>
                          <input
                            type="time"
                            className="form-control"
                            value={roomBooking.startTime}
                            onChange={(e) => setRoomBooking({...roomBooking, startTime: e.target.value})}
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">End Time</label>
                          <input
                            type="time"
                            className="form-control"
                            value={roomBooking.endTime}
                            onChange={(e) => setRoomBooking({...roomBooking, endTime: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Meeting Title</label>
                        <input
                          type="text"
                          className="form-control"
                          value={roomBooking.title}
                          onChange={(e) => setRoomBooking({...roomBooking, title: e.target.value})}
                          placeholder="Enter meeting title..."
                          required
                        />
                      </div>
                      
                      <div className="mb-3">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="teamsLink"
                            checked={roomBooking.teamsLink}
                            onChange={(e) => setRoomBooking({...roomBooking, teamsLink: e.target.checked})}
                          />
                          <label className="form-check-label" htmlFor="teamsLink">
                            <Link2 size={16} className="me-2" />
                            Create Teams meeting link
                          </label>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          value={roomBooking.description}
                          onChange={(e) => setRoomBooking({...roomBooking, description: e.target.value})}
                          rows={3}
                          placeholder="Describe the purpose of the meeting..."
                        ></textarea>
                      </div>

                      <div className="d-flex justify-content-end gap-2">
                        <button 
                          type="button" 
                          className="btn btn-light"
                          onClick={() => setShowRoomForm(false)}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-orange">
                          Book Room
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="row g-4">
                {filteredRooms.map(room => (
                  <div key={room.id} className="col-md-6">
                    <div className="card h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between mb-3">
                          <h5 className="card-title mb-0">{room.name}</h5>
                          <span className={`badge ${room.status === 'available' ? 'bg-success' : 'bg-warning'}`}>
                            {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                          </span>
                        </div>

                        <div className="mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <MapPin size={16} className="text-muted me-2" />
                            <span>{room.location}</span>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <Users size={16} className="text-muted me-2" />
                            <span>Capacity: {room.capacity} people</span>
                          </div>
                          <div className="d-flex flex-wrap gap-2 mb-2">
                            {room.features.map(feature => (
                              <span key={feature} className="badge bg-light text-dark">
                                {feature === 'video-conference' ? (
                                  <>
                                    <Link2 size={14} className="me-1" />
                                    Teams Enabled
                                  </>
                                ) : (
                                  feature.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                                )}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button 
                          className="btn btn-orange w-100"
                          onClick={() => {
                            setRoomBooking({...roomBooking, roomId: room.id});
                            setShowRoomForm(true);
                          }}
                          disabled={room.status !== 'available'}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings;