import React, { useState, useEffect } from 'react';
import { 
  Building, 
  MapPin, 
  Users, 
  Calendar, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  CheckCircle,
  AlertTriangle,
  Wrench,
  BookOpen,
  Monitor,
  Wifi,
  Zap,
  Thermometer
} from 'lucide-react';

interface Facility {
  id: number;
  name: string;
  type: string;
  capacity: number;
  location: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'UNAVAILABLE';
  equipment: string[];
  description?: string;
  bookings: number;
  lastMaintenance: string;
  nextMaintenance: string;
  features: string[];
}

interface Booking {
  id: number;
  facilityId: number;
  facilityName: string;
  bookedBy: string;
  purpose: string;
  startTime: string;
  endTime: string;
  date: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  attendees: number;
}

interface MaintenanceRequest {
  id: number;
  facilityId: number;
  facilityName: string;
  issue: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  reportedBy: string;
  reportedDate: string;
  assignedTo?: string;
  estimatedCompletion?: string;
}

export const FacilitiesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'facilities' | 'bookings' | 'maintenance'>('facilities');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Mock data
  const [facilities] = useState<Facility[]>([
    {
      id: 1,
      name: 'Main Computer Lab',
      type: 'COMPUTER_LAB',
      capacity: 30,
      location: 'Building A, Floor 2',
      status: 'AVAILABLE',
      equipment: ['Computers', 'Projector', 'Whiteboard', 'Air Conditioning'],
      description: 'Fully equipped computer laboratory with 30 workstations',
      bookings: 15,
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-04-15',
      features: ['Internet Access', 'Software Suite', 'Printing']
    },
    {
      id: 2,
      name: 'Science Laboratory',
      type: 'SCIENCE_LAB',
      capacity: 25,
      location: 'Building B, Floor 1',
      status: 'OCCUPIED',
      equipment: ['Lab Benches', 'Fume Hood', 'Safety Equipment', 'Microscopes'],
      description: 'Chemistry and Biology laboratory',
      bookings: 20,
      lastMaintenance: '2024-02-01',
      nextMaintenance: '2024-05-01',
      features: ['Safety Systems', 'Chemical Storage', 'Emergency Shower']
    },
    {
      id: 3,
      name: 'Main Hall',
      type: 'ASSEMBLY_HALL',
      capacity: 200,
      location: 'Building C',
      status: 'MAINTENANCE',
      equipment: ['Sound System', 'Stage', 'Lighting', 'Seating'],
      description: 'Main assembly hall for school events',
      bookings: 8,
      lastMaintenance: '2024-01-20',
      nextMaintenance: '2024-03-20',
      features: ['Audio/Visual', 'Stage Lighting', 'Climate Control']
    },
    {
      id: 4,
      name: 'Library',
      type: 'LIBRARY',
      capacity: 50,
      location: 'Building A, Floor 1',
      status: 'AVAILABLE',
      equipment: ['Books', 'Computers', 'Study Tables', 'WiFi'],
      description: 'Main library with study areas and computer access',
      bookings: 12,
      lastMaintenance: '2024-02-10',
      nextMaintenance: '2024-05-10',
      features: ['Silent Study', 'Group Study', 'Digital Resources']
    },
    {
      id: 5,
      name: 'Gymnasium',
      type: 'SPORTS_FACILITY',
      capacity: 100,
      location: 'Sports Complex',
      status: 'UNAVAILABLE',
      equipment: ['Basketball Court', 'Volleyball Net', 'Sound System'],
      description: 'Indoor sports facility for physical education',
      bookings: 5,
      lastMaintenance: '2024-01-05',
      nextMaintenance: '2024-04-05',
      features: ['Climate Control', 'Changing Rooms', 'Equipment Storage']
    }
  ]);

  const [bookings] = useState<Booking[]>([
    {
      id: 1,
      facilityId: 1,
      facilityName: 'Main Computer Lab',
      bookedBy: 'John Smith',
      purpose: 'Computer Science Class',
      startTime: '09:00',
      endTime: '10:30',
      date: '2024-03-15',
      status: 'CONFIRMED',
      attendees: 25
    },
    {
      id: 2,
      facilityId: 2,
      facilityName: 'Science Laboratory',
      bookedBy: 'Mary Johnson',
      purpose: 'Chemistry Practical',
      startTime: '14:00',
      endTime: '15:30',
      date: '2024-03-15',
      status: 'PENDING',
      attendees: 20
    },
    {
      id: 3,
      facilityId: 3,
      facilityName: 'Main Hall',
      bookedBy: 'David Wilson',
      purpose: 'School Assembly',
      startTime: '08:00',
      endTime: '09:00',
      date: '2024-03-16',
      status: 'CONFIRMED',
      attendees: 150
    }
  ]);

  const [maintenanceRequests] = useState<MaintenanceRequest[]>([
    {
      id: 1,
      facilityId: 1,
      facilityName: 'Main Computer Lab',
      issue: 'Air conditioning not working properly',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      reportedBy: 'Jane Doe',
      reportedDate: '2024-03-10',
      assignedTo: 'Maintenance Team A',
      estimatedCompletion: '2024-03-16'
    },
    {
      id: 2,
      facilityId: 3,
      facilityName: 'Main Hall',
      issue: 'Sound system needs repair',
      priority: 'MEDIUM',
      status: 'OPEN',
      reportedBy: 'Mike Wilson',
      reportedDate: '2024-03-12'
    },
    {
      id: 3,
      facilityId: 5,
      facilityName: 'Gymnasium',
      issue: 'Floor needs refinishing',
      priority: 'URGENT',
      status: 'IN_PROGRESS',
      reportedBy: 'Sports Coordinator',
      reportedDate: '2024-03-08',
      assignedTo: 'Maintenance Team B',
      estimatedCompletion: '2024-03-20'
    }
  ]);

  const facilityTypes = [
    { value: 'CLASSROOM', label: 'Classroom' },
    { value: 'COMPUTER_LAB', label: 'Computer Lab' },
    { value: 'SCIENCE_LAB', label: 'Science Lab' },
    { value: 'LIBRARY', label: 'Library' },
    { value: 'ASSEMBLY_HALL', label: 'Assembly Hall' },
    { value: 'SPORTS_FACILITY', label: 'Sports Facility' },
    { value: 'CAFETERIA', label: 'Cafeteria' },
    { value: 'OFFICE', label: 'Office' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800';
      case 'OCCUPIED': return 'bg-blue-100 text-blue-800';
      case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-800';
      case 'UNAVAILABLE': return 'bg-red-100 text-red-800';
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'OPEN': return 'bg-red-100 text-red-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-gray-100 text-gray-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'URGENT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return <CheckCircle size={16} className="text-green-600" />;
      case 'OCCUPIED': return <Users size={16} className="text-blue-600" />;
      case 'MAINTENANCE': return <Wrench size={16} className="text-yellow-600" />;
      case 'UNAVAILABLE': return <AlertTriangle size={16} className="text-red-600" />;
      default: return <Building size={16} className="text-gray-600" />;
    }
  };

  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facility.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || facility.type === filterType;
    const matchesStatus = !filterStatus || facility.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.bookedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredMaintenanceRequests = maintenanceRequests.filter(request => {
    const matchesSearch = request.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.reportedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || request.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Facilities Management</h1>
          <p className="text-gray-600 mt-2">Manage school facilities, bookings, and maintenance</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={16} />
          Add Facility
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Building size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{facilities.length}</div>
              <div className="text-sm text-gray-500">Total Facilities</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {facilities.filter(f => f.status === 'AVAILABLE').length}
              </div>
              <div className="text-sm text-gray-500">Available Now</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <Calendar size={20} className="text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {bookings.filter(b => b.status === 'CONFIRMED').length}
              </div>
              <div className="text-sm text-gray-500">Active Bookings</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg mr-3">
              <Wrench size={20} className="text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {maintenanceRequests.filter(r => r.status === 'OPEN' || r.status === 'IN_PROGRESS').length}
              </div>
              <div className="text-sm text-gray-500">Maintenance Issues</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'facilities', label: 'Facilities', icon: Building },
            { id: 'bookings', label: 'Bookings', icon: Calendar },
            { id: 'maintenance', label: 'Maintenance', icon: Wrench }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {activeTab === 'facilities' && (
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                {facilityTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              {activeTab === 'facilities' && (
                <>
                  <option value="AVAILABLE">Available</option>
                  <option value="OCCUPIED">Occupied</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="UNAVAILABLE">Unavailable</option>
                </>
              )}
              {activeTab === 'bookings' && (
                <>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PENDING">Pending</option>
                  <option value="CANCELLED">Cancelled</option>
                </>
              )}
              {activeTab === 'maintenance' && (
                <>
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'facilities' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Facility
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bookings
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFacilities.map((facility) => (
                  <tr key={facility.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(facility.status)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{facility.name}</div>
                          {facility.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">{facility.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {facilityTypes.find(t => t.value === facility.type)?.label}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <MapPin size={14} className="mr-1 text-gray-400" />
                        {facility.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Users size={14} className="mr-1 text-gray-400" />
                        {facility.capacity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(facility.status)}`}>
                        {facility.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{facility.bookings} this month</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye size={16} />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit size={16} />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Facility
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booked By
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendees
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.facilityName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.bookedBy}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.purpose}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1 text-gray-400" />
                          {booking.date}
                        </div>
                        <div className="flex items-center mt-1">
                          <Clock size={14} className="mr-1 text-gray-400" />
                          {booking.startTime} - {booking.endTime}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Users size={14} className="mr-1 text-gray-400" />
                        {booking.attendees}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye size={16} />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit size={16} />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Facility
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reported By
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMaintenanceRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.facilityName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{request.issue}</div>
                      {request.assignedTo && (
                        <div className="text-xs text-gray-500 mt-1">Assigned to: {request.assignedTo}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.reportedBy}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.reportedDate}</div>
                      {request.estimatedCompletion && (
                        <div className="text-xs text-gray-500 mt-1">ETA: {request.estimatedCompletion}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye size={16} />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit size={16} />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}; 