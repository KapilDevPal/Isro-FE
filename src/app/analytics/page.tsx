'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart
} from 'recharts';
import { 
  TrendingUp, 
  Rocket, 
  Calculator, 
  Target, 
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Globe,
  Calendar,
  Activity,
  Award,
  Clock,
  MapPin
} from 'lucide-react';
import Navigation from '@/components/Navigation';

interface LaunchSuccessData {
  organization: string;
  total_launches: number;
  successful: number;
  failed: number;
  other: number;
  success_rate: number;
}

interface RocketPayloadData {
  id: number;
  name: string;
  payload_capacity: number;
  mass: number;
  height: number;
  stages: number;
  organization: string;
  mass_to_payload_ratio: number;
}

interface CostEstimatorData {
  rockets: Array<{
    id: number;
    name: string;
    payload_capacity: number;
    mass: number;
  }>;
  satellites: Array<{
    id: number;
    name: string;
    mass: number;
    purpose: string;
  }>;
  cost_factors: {
    rocket_cost_per_kg: number;
    satellite_cost_per_kg: number;
    launch_services: number;
    insurance: number;
    contingency: number;
  };
}

interface HumanSpaceMission {
  id: number;
  name: string;
  status: string;
  start_date: string;
  end_date: string | null;
  astronaut_count: number;
  duration_days: number | null;
}

interface AstronautStats {
  nationality_distribution: Array<{ nationality: string; count: number }>;
  status_distribution: Array<{ status: string; count: number }>;
  top_astronauts: Array<{
    id: number;
    name: string;
    nationality: string;
    mission_count: number;
  }>;
}

interface LaunchTrends {
  date: string;
  total: number;
  successful: number;
  failed: number;
  success_rate: number;
}

interface OrganizationPerformance {
  id: number;
  name: string;
  country: string;
  rocket_count: number;
  satellite_count: number;
  launch_count: number;
  successful_launches: number;
  success_rate: number;
}

interface MissionProgressData {
  id: number;
  name: string;
  status: string;
  start_date: string;
  end_date: string | null;
  milestone_progress: number;
  total_milestones: number;
  completed_milestones: number;
  total_objectives: number;
  primary_objectives: number;
  crew_assigned: number;
  total_crew_positions: number;
}

interface MissionTimelineData {
  id: number;
  name: string;
  status: string;
  start_date: string;
  end_date: string | null;
  organization_names: string[];
  astronaut_count: number;
  milestone_count: number;
  completed_milestones: number;
  duration_days: number | null;
}

interface OrbitDistributionData {
  categorized: Array<{ category: string; count: number }>;
  detailed: Array<{ orbit_type: string; count: number; percentage: number }>;
  total_satellites: number;
}

interface MissionFamilyTreeData {
  id: number;
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string | null;
  organizations: Array<{ id: number; name: string; country: string }>;
  rockets: string[];
  satellites: string[];
  milestone_count: number;
  completed_milestones: number;
  related_missions: Array<{ id: number; name: string; relation: string }>;
}

export default function AnalyticsPage() {
  const [launchSuccessData, setLaunchSuccessData] = useState<LaunchSuccessData[]>([]);
  const [rocketPayloadData, setRocketPayloadData] = useState<RocketPayloadData[]>([]);
  const [costEstimatorData, setCostEstimatorData] = useState<CostEstimatorData | null>(null);
  const [humanSpaceMissions, setHumanSpaceMissions] = useState<HumanSpaceMission[]>([]);
  const [astronautStats, setAstronautStats] = useState<AstronautStats | null>(null);
  const [launchTrends, setLaunchTrends] = useState<LaunchTrends[]>([]);
  const [organizationPerformance, setOrganizationPerformance] = useState<OrganizationPerformance[]>([]);
  const [missionProgressData, setMissionProgressData] = useState<MissionProgressData[]>([]);
  const [missionTimelineData, setMissionTimelineData] = useState<MissionTimelineData[]>([]);
  const [orbitDistributionData, setOrbitDistributionData] = useState<OrbitDistributionData | null>(null);
  const [missionFamilyTreeData, setMissionFamilyTreeData] = useState<MissionFamilyTreeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRocket, setSelectedRocket] = useState<number | null>(null);
  const [selectedSatellite, setSelectedSatellite] = useState<number | null>(null);
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'human-missions' | 'rockets' | 'costs' | 'timeline' | 'orbits' | 'missions' | 'family'>('overview');

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const [
        successResponse, 
        payloadResponse, 
        costResponse,
        humanMissionsResponse,
        astronautResponse,
        trendsResponse,
        performanceResponse,
        progressResponse,
        timelineResponse,
        orbitResponse,
        familyTreeResponse
      ] = await Promise.all([
        fetch('http://localhost:3001/api/v1/dashboard/launch_success_rates'),
        fetch('http://localhost:3001/api/v1/dashboard/top_rockets_by_payload'),
        fetch('http://localhost:3001/api/v1/dashboard/mission_cost_estimator'),
        fetch('http://localhost:3001/api/v1/dashboard/human_space_missions'),
        fetch('http://localhost:3001/api/v1/dashboard/astronaut_statistics'),
        fetch('http://localhost:3001/api/v1/dashboard/launch_trends'),
        fetch('http://localhost:3001/api/v1/dashboard/organization_performance'),
        fetch('http://localhost:3001/api/v1/dashboard/mission_progress_visualization'),
        fetch('http://localhost:3001/api/v1/dashboard/mission_timeline_visualization'),
        fetch('http://localhost:3001/api/v1/dashboard/orbit_distribution'),
        fetch('http://localhost:3001/api/v1/dashboard/mission_family_tree')
      ]);

      const successData = await successResponse.json();
      const payloadData = await payloadResponse.json();
      const costData = await costResponse.json();
      const humanData = await humanMissionsResponse.json();
      const astronautData = await astronautResponse.json();
      const trendsData = await trendsResponse.json();
      const performanceData = await performanceResponse.json();
      const progressData = await progressResponse.json();
      const timelineData = await timelineResponse.json();
      const orbitData = await orbitResponse.json();
      const familyTreeData = await familyTreeResponse.json();

      setLaunchSuccessData(successData.data);
      setRocketPayloadData(payloadData.data);
      setCostEstimatorData(costData);
      setHumanSpaceMissions(humanData.data);
      setAstronautStats(astronautData);
      setLaunchTrends(trendsData.data);
      setOrganizationPerformance(performanceData.data);
      setMissionProgressData(progressData.data);
      setMissionTimelineData(timelineData.data);
      setOrbitDistributionData(orbitData);
      setMissionFamilyTreeData(familyTreeData.data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMissionCost = () => {
    if (!costEstimatorData || selectedRocket === null || selectedSatellite === null) return;

    const rocket = costEstimatorData.rockets.find(r => r.id === selectedRocket);
    const satellite = costEstimatorData.satellites.find(s => s.id === selectedSatellite);

    if (!rocket || !satellite) return;

    const rocketCost = rocket.payload_capacity * costEstimatorData.cost_factors.rocket_cost_per_kg;
    const satelliteCost = satellite.mass * costEstimatorData.cost_factors.satellite_cost_per_kg;
    const launchServicesCost = satellite.mass * costEstimatorData.cost_factors.launch_services;
    
    const subtotal = rocketCost + satelliteCost + launchServicesCost;
    const insuranceCost = subtotal * costEstimatorData.cost_factors.insurance;
    const contingencyCost = subtotal * costEstimatorData.cost_factors.contingency;
    
    const totalCost = subtotal + insuranceCost + contingencyCost;
    setEstimatedCost(totalCost);
  };

  const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'ongoing': return 'text-blue-400';
      case 'planned': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-blue-400 text-lg">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 lg:mb-12"
        >
          <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 lg:mb-6">
            Space Analytics Dashboard
          </h1>
          <p className="text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto px-4">
            Comprehensive insights into launch success rates, rocket capabilities, human space missions, and mission cost estimation
          </p>
        </motion.div>

        {/* Mobile Navigation Tabs */}
        <div className="lg:hidden mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {['overview', 'human-missions', 'rockets', 'costs', 'timeline', 'orbits', 'missions', 'family'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {tab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Section */}
        <div className={`${activeTab === 'overview' || window.innerWidth >= 1024 ? 'block' : 'hidden lg:block'}`}>
          {/* Key Metrics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8"
          >
            {[
              { icon: Rocket, label: 'Total Rockets', value: rocketPayloadData.length, color: 'blue' },
              { icon: Users, label: 'Human Missions', value: humanSpaceMissions.length, color: 'green' },
              { icon: Globe, label: 'Organizations', value: launchSuccessData.length, color: 'purple' },
              { icon: Activity, label: 'Total Satellites', value: orbitDistributionData?.total_satellites || 0, color: 'yellow' }
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-4 lg:p-6 border border-slate-600 text-center"
              >
                <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-${metric.color}-500/20 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                  <metric.icon className={`w-5 h-5 lg:w-6 lg:h-6 text-${metric.color}-400`} />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1">{metric.value}</div>
                <div className="text-sm lg:text-base text-gray-400">{metric.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Launch Success Rate Chart */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-4 lg:p-8 mb-8 border border-slate-600"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-white">Launch Success Rate by Agency</h2>
                <p className="text-sm lg:text-base text-gray-400">Historical success/failure ratios across space organizations</p>
              </div>
            </div>

            <div className="h-64 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={launchSuccessData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis 
                    dataKey="organization" 
                    stroke="#94A3B8"
                    fontSize={10}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis stroke="#94A3B8" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1E293B', 
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '12px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="successful" fill="#10B981" name="Successful" />
                  <Bar dataKey="failed" fill="#EF4444" name="Failed" />
                  <Bar dataKey="other" fill="#F59E0B" name="Other" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Human Space Missions Section */}
        <div className={`${activeTab === 'human-missions' || window.innerWidth >= 1024 ? 'block' : 'hidden lg:block'}`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-4 lg:p-8 mb-8 border border-slate-600"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 lg:w-6 lg:h-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-white">Human Space Missions</h2>
                <p className="text-sm lg:text-base text-gray-400">Crewed missions and astronaut statistics</p>
              </div>
            </div>

            {astronautStats && (
              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* Astronaut Nationality Distribution */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={astronautStats.nationality_distribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ nationality, count }) => `${nationality}: ${count}`}
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {astronautStats.nationality_distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1E293B', 
                          border: '1px solid #475569',
                          borderRadius: '8px',
                          color: '#F1F5F9'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Astronaut Status Distribution */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={astronautStats.status_distribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis dataKey="status" stroke="#94A3B8" fontSize={12} />
                      <YAxis stroke="#94A3B8" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1E293B', 
                          border: '1px solid #475569',
                          borderRadius: '8px',
                          color: '#F1F5F9'
                        }}
                      />
                      <Bar dataKey="count" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Human Space Missions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left py-3 px-2 lg:px-4 text-gray-300 font-semibold">Mission</th>
                    <th className="text-left py-3 px-2 lg:px-4 text-gray-300 font-semibold">Status</th>
                    <th className="text-left py-3 px-2 lg:px-4 text-gray-300 font-semibold">Astronauts</th>
                    <th className="text-left py-3 px-2 lg:px-4 text-gray-300 font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {humanSpaceMissions.slice(0, 10).map((mission) => (
                    <tr key={mission.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                      <td className="py-3 px-2 lg:px-4 text-white font-medium text-sm">{mission.name}</td>
                      <td className="py-3 px-2 lg:px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mission.status)}`}>
                          {mission.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 lg:px-4 text-blue-400 font-mono">{mission.astronaut_count}</td>
                      <td className="py-3 px-2 lg:px-4 text-gray-300 font-mono">
                        {mission.duration_days ? `${mission.duration_days} days` : 'Ongoing'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Rockets Section */}
        <div className={`${activeTab === 'rockets' || window.innerWidth >= 1024 ? 'block' : 'hidden lg:block'}`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-4 lg:p-8 mb-8 border border-slate-600"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Rocket className="w-5 h-5 lg:w-6 lg:h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-white">Top Rockets by Payload Capacity</h2>
                <p className="text-sm lg:text-base text-gray-400">Ranked visualization of rocket capabilities</p>
              </div>
            </div>

            <div className="h-64 lg:h-96 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={rocketPayloadData.slice(0, 10)} 
                  layout="horizontal"
                  margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis 
                    type="number" 
                    stroke="#94A3B8"
                    fontSize={10}
                    label={{ value: 'Payload Capacity (kg)', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    stroke="#94A3B8"
                    fontSize={9}
                    width={70}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1E293B', 
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9'
                    }}
                    formatter={(value, name) => [
                      `${value.toLocaleString()} kg`,
                      name === 'payload_capacity' ? 'Payload Capacity' : name
                    ]}
                  />
                  <Bar 
                    dataKey="payload_capacity" 
                    fill="#3B82F6" 
                    name="Payload Capacity"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Rocket Details Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left py-3 px-2 lg:px-4 text-gray-300 font-semibold">Rocket</th>
                    <th className="text-left py-3 px-2 lg:px-4 text-gray-300 font-semibold">Org</th>
                    <th className="text-right py-3 px-2 lg:px-4 text-gray-300 font-semibold">Payload</th>
                    <th className="text-right py-3 px-2 lg:px-4 text-gray-300 font-semibold">Mass</th>
                    <th className="text-right py-3 px-2 lg:px-4 text-gray-300 font-semibold">Height</th>
                  </tr>
                </thead>
                <tbody>
                  {rocketPayloadData.slice(0, 8).map((rocket) => (
                    <tr key={rocket.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                      <td className="py-3 px-2 lg:px-4 text-white font-medium text-sm">{rocket.name}</td>
                      <td className="py-3 px-2 lg:px-4 text-gray-400 text-sm">{rocket.organization}</td>
                      <td className="py-3 px-2 lg:px-4 text-right text-blue-400 font-mono text-sm">
                        {rocket.payload_capacity.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 lg:px-4 text-right text-gray-300 font-mono text-sm">
                        {rocket.mass.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 lg:px-4 text-right text-gray-300 font-mono text-sm">
                        {rocket.height}m
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Mission Cost Estimator Section */}
        <div className={`${activeTab === 'costs' || window.innerWidth >= 1024 ? 'block' : 'hidden lg:block'}`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-4 lg:p-8 mb-8 border border-slate-600"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 lg:w-6 lg:h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-white">Mission Cost Estimator</h2>
                <p className="text-sm lg:text-base text-gray-400">Calculate estimated costs for space missions</p>
              </div>
            </div>

            {costEstimatorData && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Cost Calculator Form */}
                <div className="space-y-4 lg:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Rocket
                    </label>
                    <select
                      value={selectedRocket || ''}
                      onChange={(e) => setSelectedRocket(Number(e.target.value) || null)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 lg:px-4 py-2 lg:py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">Choose a rocket...</option>
                      {costEstimatorData.rockets.map((rocket) => (
                        <option key={rocket.id} value={rocket.id}>
                          {rocket.name} ({rocket.payload_capacity.toLocaleString()} kg payload)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Satellite
                    </label>
                    <select
                      value={selectedSatellite || ''}
                      onChange={(e) => setSelectedSatellite(Number(e.target.value) || null)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 lg:px-4 py-2 lg:py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">Choose a satellite...</option>
                      {costEstimatorData.satellites.map((satellite) => (
                        <option key={satellite.id} value={satellite.id}>
                          {satellite.name} ({satellite.mass} kg - {satellite.purpose})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={calculateMissionCost}
                    disabled={!selectedRocket || !selectedSatellite}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 lg:py-3 px-4 lg:px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm lg:text-base"
                  >
                    Calculate Mission Cost
                  </button>

                  {estimatedCost && (
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 lg:p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-green-400" />
                        <h3 className="text-base lg:text-lg font-semibold text-green-400">Estimated Mission Cost</h3>
                      </div>
                      <div className="text-2xl lg:text-3xl font-bold text-green-400 mb-2">
                        ${estimatedCost.toLocaleString()}
                      </div>
                      <p className="text-green-300 text-xs lg:text-sm">
                        Includes rocket, satellite, launch services, insurance, and contingency costs
                      </p>
                    </div>
                  )}
                </div>

                {/* Cost Breakdown Chart */}
                <div className="h-64 lg:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                                              <Pie
                          data={[
                            { name: 'Rocket', value: 40, color: '#3B82F6' },
                            { name: 'Satellite', value: 35, color: '#10B981' },
                            { name: 'Launch Services', value: 15, color: '#F59E0B' },
                            { name: 'Insurance & Contingency', value: 10, color: '#EF4444' }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                        >
                        {[
                          { name: 'Rocket', value: 40, color: '#3B82F6' },
                          { name: 'Satellite', value: 35, color: '#10B981' },
                          { name: 'Launch Services', value: 15, color: '#F59E0B' },
                          { name: 'Insurance & Contingency', value: 10, color: '#EF4444' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1E293B', 
                          border: '1px solid #475569',
                          borderRadius: '8px',
                          color: '#F1F5F9'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Timeline Section */}
        <div className={`${activeTab === 'timeline' || window.innerWidth >= 1024 ? 'block' : 'hidden lg:block'}`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 lg:p-8 border border-slate-600 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-white">Launch Trends & Timeline</h3>
                <p className="text-gray-400">Historical launch data and success rate trends</p>
              </div>
            </div>

            <div className="h-64 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={launchTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94A3B8"
                    fontSize={10}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis stroke="#94A3B8" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1E293B', 
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9'
                    }}
                  />
                  <Bar dataKey="total" fill="#3B82F6" name="Total Launches" />
                  <Line type="monotone" dataKey="success_rate" stroke="#10B981" strokeWidth={2} name="Success Rate %" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Organization Performance */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 lg:p-8 border border-slate-600 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-white">Organization Performance</h3>
                <p className="text-gray-400">Performance metrics across space organizations</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left py-3 px-2 lg:px-4 text-gray-300 font-semibold">Organization</th>
                    <th className="text-left py-3 px-2 lg:px-4 text-gray-300 font-semibold">Country</th>
                    <th className="text-left py-3 px-2 lg:px-4 text-gray-300 font-semibold">Rockets</th>
                    <th className="text-left py-3 px-2 lg:px-4 text-gray-300 font-semibold">Satellites</th>
                    <th className="text-left py-3 px-2 lg:px-4 text-gray-300 font-semibold">Launches</th>
                    <th className="text-left py-3 px-2 lg:px-4 text-gray-300 font-semibold">Success Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {organizationPerformance.slice(0, 10).map((org) => (
                    <tr key={org.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                      <td className="py-3 px-2 lg:px-4 text-white font-medium text-sm">{org.name}</td>
                      <td className="py-3 px-2 lg:px-4 text-gray-300 text-sm">{org.country}</td>
                      <td className="py-3 px-2 lg:px-4 text-blue-400 font-mono text-sm">{org.rocket_count}</td>
                      <td className="py-3 px-2 lg:px-4 text-green-400 font-mono text-sm">{org.satellite_count}</td>
                      <td className="py-3 px-2 lg:px-4 text-yellow-400 font-mono text-sm">{org.launch_count}</td>
                      <td className="py-3 px-2 lg:px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          org.success_rate >= 80 ? 'text-green-400' : 
                          org.success_rate >= 60 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {org.success_rate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Orbit Distribution Section */}
        <div className={`${activeTab === 'orbits' || window.innerWidth >= 1024 ? 'block' : 'hidden lg:block'}`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 lg:p-8 border border-slate-600 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-white">Orbit Distribution</h3>
                <p className="text-gray-400">Satellite distribution across different orbit types</p>
              </div>
            </div>

            {orbitDistributionData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Orbit Distribution Chart */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Orbit Categories</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={orbitDistributionData.categorized}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ category, count }) => `${category}: ${count}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {orbitDistributionData.categorized.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1E293B', 
                            border: '1px solid #475569',
                            borderRadius: '8px',
                            color: '#F1F5F9'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Detailed Orbit Breakdown */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Detailed Breakdown</h4>
                  <div className="space-y-3">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 font-medium">Total Satellites</span>
                        <span className="text-2xl font-bold text-white">{orbitDistributionData.total_satellites}</span>
                      </div>
                    </div>
                    
                    {orbitDistributionData.detailed.slice(0, 8).map((orbit, index) => (
                      <div key={orbit.orbit_type} className="bg-slate-700/30 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 text-sm">{orbit.orbit_type}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{orbit.count}</span>
                            <span className="text-gray-400 text-xs">({orbit.percentage}%)</span>
                          </div>
                        </div>
                        <div className="mt-2 w-full bg-slate-600 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${orbit.percentage}%`, 
                              backgroundColor: COLORS[index % COLORS.length] 
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Mission Progress Section */}
        <div className={`${activeTab === 'missions' || window.innerWidth >= 1024 ? 'block' : 'hidden lg:block'}`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 lg:p-8 border border-slate-600 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-white">Mission Progress</h3>
                <p className="text-gray-400">Progress tracking across space missions</p>
              </div>
            </div>

            {missionProgressData.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Mission Progress Chart */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Milestone Progress</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={missionProgressData.slice(0, 15)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#94A3B8"
                          fontSize={10}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis stroke="#94A3B8" fontSize={10} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1E293B', 
                            border: '1px solid #475569',
                            borderRadius: '8px',
                            color: '#F1F5F9'
                          }}
                        />
                        <Bar dataKey="milestone_progress" fill="#10B981" name="Progress %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Mission Progress Table */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Mission Details</h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {missionProgressData.slice(0, 10).map((mission) => (
                      <div key={mission.id} className="bg-slate-700/30 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-white font-medium text-sm">{mission.name}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mission.status)}`}>
                            {mission.status}
                          </span>
                        </div>
                        <div className="space-y-2 text-xs text-gray-300">
                          <div className="flex justify-between">
                            <span>Milestones:</span>
                            <span>{mission.completed_milestones}/{mission.total_milestones}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Objectives:</span>
                            <span>{mission.primary_objectives}/{mission.total_objectives}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Crew:</span>
                            <span>{mission.crew_assigned}/{mission.total_crew_positions}</span>
                          </div>
                        </div>
                        <div className="mt-2 w-full bg-slate-600 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-green-500 transition-all duration-300"
                            style={{ width: `${mission.milestone_progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Mission Family Tree Section */}
        <div className={`${activeTab === 'family' || window.innerWidth >= 1024 ? 'block' : 'hidden lg:block'}`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 lg:p-8 border border-slate-600 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-white">Mission Family Tree</h3>
                <p className="text-gray-400">Related missions by rocket, agency, and target</p>
              </div>
            </div>

            {missionFamilyTreeData.length > 0 && (
              <div className="space-y-6">
                {missionFamilyTreeData.slice(0, 8).map((mission) => (
                  <div key={mission.id} className="bg-slate-700/30 rounded-lg p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-white">{mission.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mission.status)}`}>
                            {mission.status}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">{mission.description}</p>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Organizations:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {mission.organizations.map((org) => (
                                <span key={org.id} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                                  {org.name} ({org.country})
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-gray-400">Rockets:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {mission.rockets.map((rocket, index) => (
                                <span key={index} className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">
                                  {rocket}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-gray-400">Satellites:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {mission.satellites.map((satellite, index) => (
                                <span key={index} className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs">
                                  {satellite}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 text-sm text-gray-400">
                          <span>Milestones: {mission.completed_milestones}/{mission.milestone_count}</span>
                        </div>
                      </div>
                    </div>
                    
                    {mission.related_missions.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-600">
                        <h5 className="text-sm font-medium text-gray-300 mb-2">Related Missions:</h5>
                        <div className="flex flex-wrap gap-2">
                          {mission.related_missions.map((related) => (
                            <div key={related.id} className="px-3 py-2 bg-slate-600/50 rounded-lg">
                              <div className="text-white text-sm font-medium">{related.name}</div>
                              <div className="text-gray-400 text-xs">{related.relation}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
} 