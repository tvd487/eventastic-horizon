
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminStats from '@/components/admin/AdminStats';
import AdminUsersList from '@/components/admin/AdminUsersList';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Check if user has admin role
  React.useEffect(() => {
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      const user = JSON.parse(userString);
      if (user.role !== 'admin') {
        navigate('/select-role');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4">
          <AdminSidebar />
        </div>
        <div className="w-full md:w-3/4 space-y-8">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          
          <AdminStats />
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
            <AdminUsersList />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
