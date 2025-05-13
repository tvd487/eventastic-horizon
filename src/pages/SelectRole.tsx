
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import RoleSelect from '../components/auth/RoleSelect';

const SelectRole: React.FC = () => {
  const navigate = useNavigate();
  
  const handleRoleSelect = (role: string) => {
    // Get current user from localStorage
    const userString = localStorage.getItem('currentUser');
    
    if (userString) {
      const user = JSON.parse(userString);
      
      // Update user with selected role
      const updatedUser = {
        ...user,
        role: role
      };
      
      // Save updated user
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Navigate based on role
      switch (role) {
        case 'attendee':
          navigate('/attendee/dashboard');
          break;
        case 'organizer':
          navigate('/organizer/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    } else {
      // No user found, redirect to login
      navigate('/login');
    }
  };
  
  return (
    <MainLayout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <RoleSelect onRoleSelect={handleRoleSelect} />
      </div>
    </MainLayout>
  );
};

export default SelectRole;
