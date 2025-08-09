'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Satellite, Building2, Calendar, ArrowRight } from 'lucide-react';
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
  organization?: {
    id: number;
    name: string;
  };
  launches?: Array<{
    id: number;
    name: string;
    status: string;
    launch_date: string;
  }>;
}

export default function SatelliteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [satellite, setSatellite] = useState<Satellite | null>(null);
  const [loading, setLoading] = useState(true);
  const [satelliteId, setSatelliteId] = useState<string>('');

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setSatelliteId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!satelliteId) return;
    
    fetch(`http://localhost:3001/api/v1/satellites/${satelliteId}`)
      .then(res => res.json())
      .then(data => {
        setSatellite(data.satellite || data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching satellite:', error);
        setLoading(false);
      });
  }, [satelliteId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!satellite) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Navigation />
        <div className="pt-20 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Satellite not found</h1>
          <Link href="/satellites">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
              Back to Satellites
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      
      {/* Header */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4">
          <Link href="/satellites">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Satellites
            </motion.button>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {satellite.name}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">{satellite.organization?.name || 'Unknown Organization'}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                satellite.status === 'active' ? 'bg-green-500/20 text-green-400' :
                satellite.status === 'inactive' ? 'bg-red-500/20 text-red-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {satellite.status}
              </span>
            </div>
            <p className="text-xl text-gray-300 max-w-4xl">
              {satellite.purpose}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Satellite Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-slate-800 rounded-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-bold mb-6">Specifications</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Satellite className="w-6 h-6 text-blue-400" />
                    <div>
                      <div className="text-gray-400 text-sm">Mass</div>
                      <div className="text-white font-semibold">{satellite.mass.toLocaleString()} kg</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Satellite className="w-6 h-6 text-green-400" />
                    <div>
                      <div className="text-gray-400 text-sm">Height</div>
                      <div className="text-white font-semibold">{satellite.height} m</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Satellite className="w-6 h-6 text-purple-400" />
                    <div>
                      <div className="text-gray-400 text-sm">Width</div>
                      <div className="text-white font-semibold">{satellite.width} m</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Satellite className="w-6 h-6 text-yellow-400" />
                    <div>
                      <div className="text-gray-400 text-sm">Depth</div>
                      <div className="text-white font-semibold">{satellite.depth} m</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Satellite className="w-6 h-6 text-red-400" />
                    <div>
                      <div className="text-gray-400 text-sm">Orbit Type</div>
                      <div className="text-white font-semibold">{satellite.orbit_type}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-indigo-400" />
                    <div>
                      <div className="text-gray-400 text-sm">Organization</div>
                      <div className="text-white font-semibold">{satellite.organization?.name || 'Unknown Organization'}</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Launch Info */}
              {satellite.launch_date && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="bg-slate-800 rounded-lg p-8 mb-8"
                >
                  <h2 className="text-2xl font-bold mb-6">Launch Information</h2>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-blue-400" />
                    <div>
                      <div className="text-gray-400 text-sm">Launch Date</div>
                      <div className="text-white font-semibold">
                        {new Date(satellite.launch_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Launches */}
              {satellite.launches && satellite.launches.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="bg-slate-800 rounded-lg p-8"
                >
                  <h2 className="text-2xl font-bold mb-6">Launch History</h2>
                  <div className="space-y-4">
                    {satellite.launches.map((launch) => (
                      <Link key={launch.id} href={`/launches/${launch.id}`}>
                        <div className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold mb-2">{launch.name}</h3>
                              <div className="text-sm text-gray-400">
                                {new Date(launch.launch_date).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                launch.status === 'success' ? 'bg-green-500/20 text-green-400' :
                                launch.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                                'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {launch.status}
                              </span>
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-slate-800 rounded-lg p-6 sticky top-24"
              >
                <h3 className="text-xl font-bold mb-4">Quick Info</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-gray-400 text-sm">Organization</div>
                    <div className="text-white font-semibold">{satellite.organization?.name || 'Unknown Organization'}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Status</div>
                    <div className="text-white font-semibold">{satellite.status}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Orbit Type</div>
                    <div className="text-white font-semibold">{satellite.orbit_type}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Volume</div>
                    <div className="text-white font-semibold">{(satellite.height * satellite.width * satellite.depth).toFixed(2)} m³</div>
                  </div>
                </div>

                {satellite.organization && (
                  <div className="mt-6 pt-6 border-t border-slate-700">
                    <Link href={`/organizations/${satellite.organization.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors"
                      >
                        View Organization
                      </motion.button>
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 