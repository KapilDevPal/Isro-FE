'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2, Rocket, Satellite, Calendar, Globe, Users } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

interface Organization {
  id: number;
  name: string;
  country: string;
  type: string;
  description: string;
  founded_year: number;
  rockets: Array<{
    id: number;
    name: string;
    status: string;
  }>;
  satellites: Array<{
    id: number;
    name: string;
    status: string;
  }>;
  launches: Array<{
    id: number;
    name: string;
    status: string;
  }>;
}

export default function OrganizationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [orgId, setOrgId] = useState<string>('');

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setOrgId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!orgId) return;
    
    fetch(`http://localhost:3001/api/v1/organizations/${orgId}`)
      .then(res => res.json())
      .then(data => {
        setOrganization(data.organization || data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching organization:', error);
        setLoading(false);
      });
  }, [orgId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Navigation />
        <div className="pt-20 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Organization not found</h1>
          <Link href="/organizations">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
              Back to Organizations
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
          <Link href="/organizations">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Organizations
            </motion.button>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {organization.name}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">{organization.country}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                organization.type === 'Government' ? 'bg-blue-500/20 text-blue-400' :
                organization.type === 'Private' ? 'bg-green-500/20 text-green-400' :
                'bg-purple-500/20 text-purple-400'
              }`}>
                {organization.type}
              </span>
            </div>
            <p className="text-xl text-gray-300 max-w-4xl">
              {organization.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Organization Details */}
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
                <h2 className="text-2xl font-bold mb-6">Organization Information</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-blue-400" />
                    <div>
                      <div className="text-gray-400 text-sm">Founded</div>
                      <div className="text-white font-semibold">{organization.founded_year}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Globe className="w-6 h-6 text-green-400" />
                    <div>
                      <div className="text-gray-400 text-sm">Country</div>
                      <div className="text-white font-semibold">{organization.country}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Rocket className="w-6 h-6 text-purple-400" />
                    <div>
                      <div className="text-gray-400 text-sm">Rockets</div>
                      <div className="text-white font-semibold">{organization.rockets?.length || 0}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Satellite className="w-6 h-6 text-yellow-400" />
                    <div>
                      <div className="text-gray-400 text-sm">Satellites</div>
                      <div className="text-white font-semibold">{organization.satellites?.length || 0}</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Rockets */}
              {organization.rockets && organization.rockets.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="bg-slate-800 rounded-lg p-8 mb-8"
                >
                  <h2 className="text-2xl font-bold mb-6">Rockets</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {organization.rockets.map((rocket) => (
                      <Link key={rocket.id} href={`/rockets/${rocket.id}`}>
                        <div className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors cursor-pointer">
                          <h3 className="text-lg font-semibold mb-2">{rocket.name}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            rocket.status === 'active' ? 'bg-green-500/20 text-green-400' :
                            rocket.status === 'retired' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {rocket.status}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Satellites */}
              {organization.satellites && organization.satellites.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="bg-slate-800 rounded-lg p-8"
                >
                  <h2 className="text-2xl font-bold mb-6">Satellites</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {organization.satellites.map((satellite) => (
                      <Link key={satellite.id} href={`/satellites/${satellite.id}`}>
                        <div className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors cursor-pointer">
                          <h3 className="text-lg font-semibold mb-2">{satellite.name}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            satellite.status === 'active' ? 'bg-green-500/20 text-green-400' :
                            satellite.status === 'inactive' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {satellite.status}
                          </span>
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
                <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-slate-700 rounded-lg">
                    <Rocket className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                    <div className="text-2xl font-bold text-white">{organization.rockets?.length || 0}</div>
                    <div className="text-gray-400 text-sm">Rockets</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700 rounded-lg">
                    <Satellite className="w-8 h-8 mx-auto mb-2 text-green-400" />
                    <div className="text-2xl font-bold text-white">{organization.satellites?.length || 0}</div>
                    <div className="text-gray-400 text-sm">Satellites</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700 rounded-lg">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                    <div className="text-2xl font-bold text-white">{organization.launches?.length || 0}</div>
                    <div className="text-gray-400 text-sm">Launches</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 