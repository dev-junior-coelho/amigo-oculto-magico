import React, { useState } from 'react';
import { UserPlus, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../db/supabase';

const Home: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // 验证手机号格式
      if (!validatePhone(formData.phone)) {
        throw new Error('请输入正确的手机号格式');
      }

      // 检查手机号是否已存在
      const phoneExists = await api.checkPhoneExists(formData.phone);
      if (phoneExists) {
        throw new Error('该手机号已经登记过，一个手机号只能登记一次');
      }

      // 添加参与者
      await api.addParticipant(formData);
      
      setMessage({ type: 'success', text: '登记成功！您已成功参与抽奖活动。' });
      setFormData({ name: '', phone: '', company: '' });
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || '登记失败，请重试' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            KDD China 2025 现场抽奖
          </h1>
          <p className="text-xl text-gray-600">
            欢迎参与抽奖活动，请填写您的信息完成登记
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                姓名 *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                placeholder="请输入您的姓名"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                手机号 *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                placeholder="请输入您的手机号"
                required
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                单位 *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                placeholder="请输入您的工作单位"
                required
              />
            </div>

            {message && (
              <div className={`p-4 rounded-md flex items-center space-x-2 ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-md hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '登记中...' : '确认登记'}
            </button>
          </form>

          <div className="mt-8 p-4 bg-blue-50 rounded-md">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">抽奖规则</h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• 每次抽取5位中奖人员</li>
              <li>• 一人只能中奖一次</li>
              <li>• 一个手机号只能登记一次</li>
              <li>• 抽奖不限次数，可多轮抽奖</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;