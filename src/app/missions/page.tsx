'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Calendar, Users, Target, ArrowRight, Clock, CheckCircle, AlertCircle, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

interface SpaceMission {
  id: number;
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  organization: {
    id: number;
    name: string;
  };
  mission_milestones: Array<{
    id: number;
    name: string;
    description: string;
    event_date: string;
    milestone_type: string;
    status: string;
  }>;
  mission_objectives: Array<{
    id: number;
    name: string;
    description: string;
    objective_type: string;
    priority: number;
    is_primary: boolean;
  }>;
}

export default function MissionsPage() {
  const [missions, setMissions] = useState<SpaceMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('http://localhost:3001/api/v1/space_missions')
      .then(res => res.json())
      .then(data => {
        setMissions(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching missions:', error);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'text-blue-400';
      case 'planned':
        return 'text-yellow-400';
      case 'completed':
        return 'text-green-400';
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ongoing':
        return <PlayCircle className="w-5 h-5" />;
      case 'planned':
        return <Clock className="w-5 h-5" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const filteredMissions = missions.filter(mission => {
    if (filter === 'all') return true;
    return mission.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-blue-400 text-lg">Loading Missions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-full px-6 py-3 mb-6">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-blue-300 text-sm font-medium">Space Missions</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
              Space Missions
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Explore ongoing and planned space missions from around the world. Track milestones, objectives, and progress of humanity's journey into space.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { key: 'all', label: 'All Missions', count: missions.length },
              { key: 'ongoing', label: 'Ongoing', count: missions.filter(m => m.status === 'ongoing').length },
              { key: 'planned', label: 'Planned', count: missions.filter(m => m.status === 'planned').length },
              { key: 'completed', label: 'Completed', count: missions.filter(m => m.status === 'completed').length }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  filter === filterOption.key
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {filterOption.label} ({filterOption.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Missions Grid */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-4">
          {filteredMissions.length === 0 ? (
            <div className="text-center py-16">
              <Star className="w-24 h-24 text-gray-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-400 mb-4">No missions found</h3>
              <p className="text-gray-500">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredMissions.map((mission, index) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-8 border border-slate-600 hover:border-slate-500 transition-all duration-300"
                >
                  {/* Mission Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{mission.name}</h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400">{mission.organization.name}</span>
                        <div className={`flex items-center gap-2 ${getStatusColor(mission.status)}`}>
                          {getStatusIcon(mission.status)}
                          <span className="capitalize">{mission.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mission Description */}
                  <p className="text-gray-300 mb-6 line-clamp-3">{mission.description}</p>

                  {/* Mission Dates */}
                  <div className="flex items-center gap-6 mb-6 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Start: {new Date(mission.start_date).toLocaleDateString()}</span>
                    </div>
                    {mission.end_date && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>End: {new Date(mission.end_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Mission Objectives */}
                  {mission.mission_objectives.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-400" />
                        Objectives
                      </h4>
                      <div className="space-y-2">
                        {mission.mission_objectives.slice(0, 3).map((objective) => (
                          <div key={objective.id} className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              objective.is_primary ? 'bg-blue-400' : 'bg-gray-500'
                            }`} />
                            <span className="text-sm text-gray-300">{objective.name}</span>
                          </div>
                        ))}
                        {mission.mission_objectives.length > 3 && (
                          <p className="text-sm text-gray-500 mt-2">
                            +{mission.mission_objectives.length - 3} more objectives
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Mission Milestones */}
                  {mission.mission_milestones.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400" />
                        Milestones
                      </h4>
                      <div className="space-y-2">
                        {mission.mission_milestones.slice(0, 3).map((milestone) => (
                          <div key={milestone.id} className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              milestone.status === 'completed' ? 'bg-green-400' : 
                              milestone.status === 'in_progress' ? 'bg-blue-400' : 'bg-gray-500'
                            }`} />
                            <span className="text-sm text-gray-300">{milestone.name}</span>
                          </div>
                        ))}
                        {mission.mission_milestones.length > 3 && (
                          <p className="text-sm text-gray-500 mt-2">
                            +{mission.mission_milestones.length - 3} more milestones
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* View Details Button */}
                  <Link href={`/missions/${mission.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Explore More?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Discover rockets, satellites, and the latest space news to expand your knowledge of space exploration.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/rockets">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Star className="w-6 h-6" />
                  Explore Rockets
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              
              <Link href="/satellites">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-300"
                >
                  <Users className="w-6 h-6" />
                  Discover Satellites
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 