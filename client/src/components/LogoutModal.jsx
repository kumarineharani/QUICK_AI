import React from 'react';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-[400px] mx-4 border border-gray-200 shadow-lg">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Confirm Logout
          </h3>
          <p className="text-gray-600 mb-8">
            Are you sure you want to logout?
          </p>
          <div className="flex gap-18 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-3 bg-gradient-to-r from-[#3c81f6] to-[#9234ea] text-white rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;