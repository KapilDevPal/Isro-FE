'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Satellite, Search, Filter, ArrowRight, Building2, Orbit } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

interface Satellite {
  id: number;
  name: string;
  purpose: string;
  mass: number;
  height: number;
  width: number;
  depth: number;
  orbit_type: string;
  status: string;
  launch_date: string;
  age_in_days: number;
  organization: {
    id: number;
    name: string;
  };
}

export default function SatellitesPage() {
  const [satellites, setSatellites] = useState<Satellite[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [selectedOrbitType, setSelectedOrbitType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/v1/satellites')
      .then(res => res.json())
      .then(data => {
        setSatellites(data.satellites || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching satellites:', error);
        setLoading(false);
      });
  }, []);

  const filteredSatellites = satellites.filter(satellite => {
    const matchesSearch = satellite.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         satellite.organization.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         satellite.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrganization = !selectedOrganization || satellite.organization.name === selectedOrganization;
    const matchesOrbitType = !selectedOrbitType || satellite.orbit_type === selectedOrbitType;
    const matchesStatus = !selectedStatus || satellite.status === selectedStatus;
    
    return matchesSearch && matchesOrganization && matchesOrbitType && matchesStatus;
  });

  const organizations = [...new Set(satellites.map(satellite => satellite.organization.name))];
  const orbitTypes = [...new Set(satellites.map(satellite => satellite.orbit_type))];
  const statuses = [...new Set(satellites.map(satellite => satellite.status))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      
      {/* Header */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Satellites
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover the satellites orbiting our planet. From communication satellites to scientific instruments, explore the technology that connects and observes our world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search satellites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Organization Filter */}
            <select
              value={selectedOrganization}
              onChange={(e) => setSelectedOrganization(e.target.value)}
              className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Organizations</option>
              {organizations.map(org => (
                <option key={org} value={org}>{org}</option>
              ))}
            </select>

            {/* Orbit Type Filter */}
            <select
              value={selectedOrbitType}
              onChange={(e) => setSelectedOrbitType(e.target.value)}
              className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Orbit Types</option>
              {orbitTypes.map(orbit => (
                <option key={orbit} value={orbit}>{orbit}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Satellites Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSatellites.map((satellite, index) => (
              <motion.div
                key={satellite.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-slate-800 rounded-lg overflow-hidden hover:bg-slate-700 transition-colors"
              >
                <div className="h-48 bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                  <Satellite className="w-16 h-16 text-white" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">{satellite.organization.name}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{satellite.name}</h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{satellite.purpose}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-400">Mass:</span>
                      <div className="text-white">{satellite.mass} kg</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Dimensions:</span>
                      <div className="text-white">{satellite.height}×{satellite.width}×{satellite.depth} m</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Orbit:</span>
                      <div className="text-white">{satellite.orbit_type}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Age:</span>
                      <div className="text-white">{satellite.age_in_days} days</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      satellite.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      satellite.status === 'inactive' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {satellite.status}
                    </span>
                    <div className="text-sm text-gray-400">
                      Launched: {new Date(satellite.launch_date).toLocaleDateString()}
                    </div>
                  </div>

                  <Link href={`/satellites/${satellite.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredSatellites.length === 0 && (
            <div className="text-center py-12">
              <Satellite className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No satellites found</h3>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 