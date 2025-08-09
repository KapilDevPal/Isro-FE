'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Search, Filter, ArrowRight, Building2 } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Pagination from '@/components/Pagination';

interface Rocket {
  id: number;
  name: string;
  description: string;
  mass: number;
  height: number;
  diameter: number;
  payload_capacity: number;
  stages: number;
  status: string;
  launch_count: number;
  success_rate: number;
  organization: {
    id: number;
    name: string;
  };
}

export default function RocketsPage() {
  const [rockets, setRockets] = useState<Rocket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetch('http://localhost:3001/api/v1/rockets')
      .then(res => res.json())
      .then(data => {
        setRockets(data.rockets || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching rockets:', error);
        setLoading(false);
      });
  }, []);

  const filteredRockets = rockets.filter(rocket => {
    const matchesSearch = rocket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rocket.organization.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrganization = !selectedOrganization || rocket.organization.name === selectedOrganization;
    const matchesStatus = !selectedStatus || rocket.status === selectedStatus;
    
    return matchesSearch && matchesOrganization && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredRockets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRockets = filteredRockets.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedOrganization, selectedStatus]);

  const organizations = [...new Set(rockets.map(rocket => rocket.organization.name))];
  const statuses = [...new Set(rockets.map(rocket => rocket.status))];

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
              Rockets
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore the world's most advanced rockets and launch vehicles. From SpaceX's Falcon to NASA's SLS, discover the engineering marvels that power space exploration.
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
                placeholder="Search rockets..."
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

      {/* Results Count */}
      <section className="py-4 bg-slate-800 border-t border-slate-700">
        <div className="container mx-auto px-4">
          <p className="text-gray-300">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredRockets.length)} of {filteredRockets.length} rockets
          </p>
        </div>
      </section>

      {/* Rockets Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentRockets.map((rocket, index) => (
              <motion.div
                key={rocket.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-slate-800 rounded-lg overflow-hidden hover:bg-slate-700 transition-colors"
              >
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Rocket className="w-16 h-16 text-white" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">{rocket.organization.name}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{rocket.name}</h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{rocket.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-400">Mass:</span>
                      <div className="text-white">{rocket.mass} kg</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Height:</span>
                      <div className="text-white">{rocket.height} m</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Payload:</span>
                      <div className="text-white">{rocket.payload_capacity} kg</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Stages:</span>
                      <div className="text-white">{rocket.stages}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      rocket.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      rocket.status === 'retired' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {rocket.status}
                    </span>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">{rocket.launch_count} launches</div>
                      <div className="text-sm text-green-400">{rocket.success_rate}% success</div>
                    </div>
                  </div>

                  <Link href={`/rockets/${rocket.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredRockets.length === 0 && (
            <div className="text-center py-12">
              <Rocket className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No rockets found</h3>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Pagination */}
          {filteredRockets.length > 0 && (
            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                className="mt-8"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 