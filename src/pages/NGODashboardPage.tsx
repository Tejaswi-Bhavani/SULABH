import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  Users, 
  MessageCircle, 
  TrendingUp, 
  Calendar,
  Plus,
  Settings,
  UserPlus,
  Crown,
  Shield,
  Eye
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const NGODashboardPage: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [selectedTab, setSelectedTab] = useState('overview')

  // Mock data for NGO dashboard
  const ngoStats = {
    totalMembers: 156,
    activeGroups: 8,
    totalSuggestions: 23,
    implementedSuggestions: 7,
    monthlyGrowth: 12
  }

  const recentActivities = [
    {
      id: 1,
      type: 'member_joined',
      message: 'New member joined Clean Water Initiative',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      type: 'suggestion_supported',
      message: 'Solar Panel Installation gained 50 supporters',
      timestamp: '4 hours ago'
    },
    {
      id: 3,
      type: 'group_created',
      message: 'New group "Urban Gardening" was created',
      timestamp: '1 day ago'
    }
  ]

  const groups = [
    {
      id: 1,
      name: 'Clean Water Initiative',
      description: 'Working towards clean water access for all communities',
      members: 45,
      suggestions: 8,
      status: 'active'
    },
    {
      id: 2,
      name: 'Urban Gardening',
      description: 'Promoting sustainable urban agriculture practices',
      members: 32,
      suggestions: 5,
      status: 'active'
    },
    {
      id: 3,
      name: 'Digital Literacy Program',
      description: 'Bridging the digital divide in rural areas',
      members: 28,
      suggestions: 4,
      status: 'active'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                NGO Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your organization's community initiatives and groups
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn-outline flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
              <button className="btn-primary flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Create Group</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'groups', label: 'Groups', icon: Users },
              { id: 'members', label: 'Members', icon: UserPlus },
              { id: 'suggestions', label: 'Suggestions', icon: MessageCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  selectedTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Members</p>
                    <p className="text-3xl font-bold text-gray-900">{ngoStats.totalMembers}</p>
                  </div>
                  <Users className="w-8 h-8 text-primary-600" />
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Groups</p>
                    <p className="text-3xl font-bold text-secondary-600">{ngoStats.activeGroups}</p>
                  </div>
                  <MessageCircle className="w-8 h-8 text-secondary-600" />
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Suggestions</p>
                    <p className="text-3xl font-bold text-warning-600">{ngoStats.totalSuggestions}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-warning-600" />
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Implemented</p>
                    <p className="text-3xl font-bold text-success-600">{ngoStats.implementedSuggestions}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-success-600" />
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Growth</p>
                    <p className="text-3xl font-bold text-error-600">+{ngoStats.monthlyGrowth}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-error-600" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Groups Tab */}
        {selectedTab === 'groups' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Discussion Groups</h2>
              <button className="btn-primary flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Create New Group</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <div key={group.id} className="card hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{group.description}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                      {group.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{group.members} members</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{group.suggestions} suggestions</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="btn-outline text-sm flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                    <button className="btn-primary text-sm flex-1">
                      <Settings className="w-4 h-4 mr-1" />
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Members Tab */}
        {selectedTab === 'members' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Organization Members</h2>
              <button className="btn-primary flex items-center space-x-2">
                <UserPlus className="w-5 h-5" />
                <span>Invite Members</span>
              </button>
            </div>

            <div className="card">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Member
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Groups
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Mock member data */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="text-primary-600 font-medium">JD</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">John Doe</div>
                            <div className="text-sm text-gray-500">john@example.com</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          <Crown className="w-3 h-3 mr-1" />
                          Admin
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        3 groups
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Jan 15, 2024
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900">Edit</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Suggestions Tab */}
        {selectedTab === 'suggestions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Organization Suggestions</h2>
              <button className="btn-primary flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>New Suggestion</span>
              </button>
            </div>

            <div className="card">
              <p className="text-gray-600 text-center py-8">
                Suggestion management interface will be implemented here.
                This will show all suggestions created by organization members.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NGODashboardPage