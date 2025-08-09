'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Rocket, Satellite, Globe, ArrowRight, Users } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

interface Organization {
  id: number;
  name: string;
  country: string;
  type: string;
  description: string;
  founded_year: number;
  rocket_count: number;
  satellite_count: number;
  launch_count: number;
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/v1/organizations')
      .then(res => res.json())
      .then(data => {
        setOrganizations(data.organizations || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching organizations:', error);
        setLoading(false);
      });
  }, []);

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = !selectedCountry || org.country === selectedCountry;
    const matchesType = !selectedType || org.type === selectedType;
    
    return matchesSearch && matchesCountry && matchesType;
  });

  const countries = [...new Set(organizations.map(org => org.country))];
  const types = [...new Set(organizations.map(org => org.type))];

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
              Space Organizations
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore the world's leading space agencies and organizations. From NASA and ISRO to SpaceX and ESA, discover the institutions driving humanity's journey into space.
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
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Country Filter */}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Organizations Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredOrganizations.map((org, index) => (
              <motion.div
                key={org.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-slate-800 rounded-lg overflow-hidden hover:bg-slate-700 transition-colors"
              >
                <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Building2 className="w-16 h-16 text-white" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">{org.country}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{org.name}</h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{org.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="text-center">
                      <Rocket className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                      <div className="text-white font-semibold">{org.rocket_count}</div>
                      <div className="text-gray-400 text-xs">Rockets</div>
                    </div>
                    <div className="text-center">
                      <Satellite className="w-5 h-5 mx-auto mb-1 text-green-400" />
                      <div className="text-white font-semibold">{org.satellite_count}</div>
                      <div className="text-gray-400 text-xs">Satellites</div>
                    </div>
                    <div className="text-center">
                      <Users className="w-5 h-5 mx-auto mb-1 text-purple-400" />
                      <div className="text-white font-semibold">{org.launch_count}</div>
                      <div className="text-gray-400 text-xs">Launches</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      org.type === 'Government' ? 'bg-blue-500/20 text-blue-400' :
                      org.type === 'Private' ? 'bg-green-500/20 text-green-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {org.type}
                    </span>
                    <div className="text-sm text-gray-400">
                      Founded: {org.founded_year}
                    </div>
                  </div>

                  <Link href={`/organizations/${org.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredOrganizations.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No organizations found</h3>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 