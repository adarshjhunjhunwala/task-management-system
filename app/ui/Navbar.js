"use client";

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = () => {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!session) return null;

  return (
    <nav className="flex justify-between items-center bg-black p-4 rounded-full border border-gray-700 mb-4">
      <h1 className="text-xl font-bold ml-4">Task Management System</h1>
      <div className="relative mr-4">
        <img
          src={session.user.image}
          alt="User Image"
          className="w-8 h-8 rounded-full cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-black text-white border border-gray-700 rounded-full shadow-lg">
            <button
              onClick={() => signOut()}
              className="block w-full px-4 py-2 text-left rounded-full hover:bg-gray-900"
            >
              <LogoutIcon /> Sign out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;