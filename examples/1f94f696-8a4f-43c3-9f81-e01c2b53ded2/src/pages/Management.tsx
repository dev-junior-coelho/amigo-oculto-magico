import React, { useState, useEffect } from 'react';
import { Users, Trophy, RefreshCw, Search } from 'lucide-react';
import { api } from '../db/supabase';
import type { Participant } from '../types/types';

const Management: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'winners' | 'eligible'>('all');

  useEffect(() => {
    loadParticipants();
  }, []);

  useEffect(() => {
    filterParticipants();
  }, [participants, searchTerm, filterType]);

  const loadParticipants = async () => {
    try {
      setLoading(true);
      const data = await api.getAllParticipants();
      setParticipants(data);
    } catch (error) {
      console.error('加载参与者数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterParticipants = () => {
    let filtered = participants;

    // 按类型筛选
    if (filterType === 'winners') {
      filtered = filtered.filter(p => p.is_winner);
    } else if (filterType === 'eligible') {
      filtered = filtered.filter(p => !p.is_winner);
    }

    // 按搜索词筛选
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.includes(searchTerm) ||
        p.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredParticipants(filtered);
  };

  const getStats = () => {
    const total = participants.length;
    const winners = participants.filter(p => p.is_winner).length;
    const eligible = total - winners;
    return { total, winners, eligible };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            人员信息管理
          </h1>
          <p className="text-xl text-gray-600">
            实时查看和管理抽奖参与者信息
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">总参与人数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Trophy className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">已中奖人数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.winners}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">可抽奖人数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.eligible}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索姓名、手机号或单位"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={loadParticipants}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
              >
                <RefreshCw className="w-4 h-4" />
                <span>刷新</span>
              </button>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-md transition duration-300 ${
                  filterType === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setFilterType('winners')}
                className={`px-4 py-2 rounded-md transition duration-300 ${
                  filterType === 'winners'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                中奖者
              </button>
              <button
                onClick={() => setFilterType('eligible')}
                className={`px-4 py-2 rounded-md transition duration-300 ${
                  filterType === 'eligible'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                可抽奖
              </button>
            </div>
          </div>
        </div>

        {/* 参与者列表 */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              参与者列表 ({filteredParticipants.length} 人)
            </h3>
          </div>

          {filteredParticipants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      序号
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      姓名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      手机号
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      单位
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      登记时间
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredParticipants.map((participant, index) => (
                    <tr key={participant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {participant.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {participant.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {participant.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {participant.is_winner ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Trophy className="w-3 h-3 mr-1" />
                            已中奖
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            可抽奖
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(participant.created_at).toLocaleString('zh-CN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">暂无符合条件的参与者</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Management;