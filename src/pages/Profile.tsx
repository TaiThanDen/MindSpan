import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { User, Mail, Calendar } from 'lucide-react';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalHighlights: 0,
    totalFolders: 0,
    joinDate: ''
  });

  useEffect(() => {
    fetchUserData();
    fetchUserStats();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
  };

  const fetchUserStats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get folders count
    const { data: folders } = await supabase
      .from('folders')
      .select('id')
      .eq('user_id', user.id);

    // Get files count
    const { data: files } = await supabase
      .from('files')
      .select('id')
      .eq('user_id', user.id);

    setStats({
      totalHighlights: files?.length || 0,
      totalFolders: folders?.length || 0,
      joinDate: new Date(user.created_at).toLocaleDateString()
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in to view your profile.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 mr-6">
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-500" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user.user_metadata?.full_name || 'User'}
              </h2>
              <div className="flex items-center text-gray-600 mt-1">
                <Mail className="w-4 h-4 mr-2" />
                {user.email}
              </div>
              <div className="flex items-center text-gray-600 mt-1">
                <Calendar className="w-4 h-4 mr-2" />
                Joined {stats.joinDate}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Statistics</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-700">Total Highlights</span>
                  <span className="font-semibold text-blue-900">{stats.totalHighlights}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Folders</span>
                  <span className="font-semibold text-blue-900">{stats.totalFolders}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Account Type</h3>
              <div className="text-green-700">
                Free Plan
                <button className="mt-2 w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;