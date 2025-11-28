import React, { useState, useEffect } from 'react';
import { Gift, RefreshCw, Trophy, Users, RotateCcw, Trash2 } from 'lucide-react';
import { api } from '../db/supabase';
import type { Participant } from '../types/types';

const Lottery: React.FC = () => {
  const [eligibleParticipants, setEligibleParticipants] = useState<Participant[]>([]);
  const [allWinners, setAllWinners] = useState<Participant[]>([]);
  const [currentWinners, setCurrentWinners] = useState<Participant[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    winners: 0,
    remaining: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [eligible, winners, all] = await Promise.all([
        api.getEligibleParticipants(),
        api.getWinners(),
        api.getAllParticipants()
      ]);

      setEligibleParticipants(eligible);
      setAllWinners(winners);
      setStats({
        total: all.length,
        winners: winners.length,
        remaining: eligible.length
      });
    } catch (error) {
      console.error('加载数据失败:', error);
    }
  };

  const startLottery = async () => {
    if (eligibleParticipants.length === 0) {
      alert('没有可抽奖的参与者');
      return;
    }

    if (eligibleParticipants.length < 5) {
      if (!confirm(`剩余参与者不足5人（剩余${eligibleParticipants.length}人），是否继续抽奖？`)) {
        return;
      }
    }

    setIsDrawing(true);
    setCurrentWinners([]);

    // 模拟抽奖动画
    const drawCount = Math.min(5, eligibleParticipants.length);
    const shuffled = [...eligibleParticipants].sort(() => Math.random() - 0.5);
    const winners = shuffled.slice(0, drawCount);

    // 动画效果
    for (let i = 0; i < drawCount; i++) {
      setTimeout(() => {
        setCurrentWinners(prev => [...prev, winners[i]]);
      }, (i + 1) * 500);
    }

    setTimeout(async () => {
      try {
        // 更新数据库中的中奖状态
        await api.updateWinnerStatus(winners.map(w => w.id));
        
        // 重新加载数据
        await loadData();
        
        setIsDrawing(false);
      } catch (error) {
        console.error('更新中奖状态失败:', error);
        setIsDrawing(false);
      }
    }, drawCount * 500 + 1000);
  };

  const resetLottery = () => {
    setCurrentWinners([]);
  };

  const resetAllWinners = async () => {
    if (!confirm('确定要重置所有中奖记录吗？此操作将清除所有中奖状态，让所有人都可以重新参与抽奖。')) {
      return;
    }

    setIsResetting(true);
    try {
      await api.resetAllWinners();
      await loadData();
      setCurrentWinners([]);
      alert('已成功重置所有中奖记录！');
    } catch (error) {
      console.error('重置失败:', error);
      alert('重置失败，请重试');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            KDD China 2025 现场抽奖
          </h1>
          <div className="flex justify-center space-x-8 text-lg">
            <div className="bg-white rounded-lg px-6 py-3 shadow-md">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">总参与人数:</span>
                <span className="font-bold text-blue-600">{stats.total}</span>
              </div>
            </div>
            <div className="bg-white rounded-lg px-6 py-3 shadow-md">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="text-gray-600">已中奖:</span>
                <span className="font-bold text-yellow-600">{stats.winners}</span>
              </div>
            </div>
            <div className="bg-white rounded-lg px-6 py-3 shadow-md">
              <div className="flex items-center space-x-2">
                <Gift className="w-5 h-5 text-green-600" />
                <span className="text-gray-600">可抽奖:</span>
                <span className="font-bold text-green-600">{stats.remaining}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="flex justify-center space-x-4">
            <button
              onClick={startLottery}
              disabled={isDrawing || eligibleParticipants.length === 0 || isResetting}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg text-xl font-bold hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isDrawing ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  <span>抽奖中...</span>
                </>
              ) : (
                <>
                  <Gift className="w-6 h-6" />
                  <span>开始抽奖</span>
                </>
              )}
            </button>

            {currentWinners.length > 0 && !isDrawing && (
              <button
                onClick={resetLottery}
                disabled={isResetting}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-lg text-xl font-bold hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <RotateCcw className="w-6 h-6" />
                <span>重新抽奖</span>
              </button>
            )}

            {allWinners.length > 0 && (
              <button
                onClick={resetAllWinners}
                disabled={isDrawing || isResetting}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-lg text-xl font-bold hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isResetting ? (
                  <>
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    <span>重置中...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-6 h-6" />
                    <span>重置所有中奖记录</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {currentWinners.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-6 text-purple-800">
              🎉 本轮中奖名单 🎉
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentWinners.map((winner, index) => (
                <div
                  key={winner.id}
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-6 rounded-lg shadow-lg transform animate-bounce"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-center">
                    <Trophy className="w-8 h-8 mx-auto mb-2" />
                    <h3 className="text-xl font-bold">{winner.name}</h3>
                    <p className="text-yellow-100">{winner.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {allWinners.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              历史中奖名单
            </h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
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
                        单位
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allWinners.map((winner, index) => (
                      <tr key={winner.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {winner.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {winner.company}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {eligibleParticipants.length === 0 && !isDrawing && (
          <div className="text-center py-12">
            <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">暂无可抽奖的参与者</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lottery;