import React, { useEffect, useState } from "react";
// import { dummyCreationData } from "../assets/assets";
import { Gem, Sparkle } from "lucide-react";
import { Protect } from "@clerk/clerk-react";
import CreationItem from "../components/CreationItem";
import axios from 'axios';
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


const Dashboard = () => {
  const [creation, setCreations] = React.useState([]);

  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const getDashboardData = async () => {
    // setCreation(dummyCreationData);
    try {

      setLoading(true)
      let token = await getToken();
      if (!token) return toast.error("Please log in to continue");

      const { data } = await axios.get('/get-user-creations', {
        headers: { Authorization: `Bearer ${token}` }
      })

      // debugging
      // console.log('API Response:', data);

      if (data.success && data.data.length > 0) {
        // console.log('Data Success : ', data.success)
        setCreations(data.data)
        toast.success(data.message || 'User Creations loaded successfully!');
      }
      else {
        toast.error(data.message || 'Failed to load user creations')
      }

    } catch (error) {
      // console.log('API error:', error);
      toast.error(`Error: ${error.message}`);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className="h-full overflow-y-scroll p-6">
      <div className="flex justify-start gap-4 flex-wrap">
        {/* total card creation */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Total Creations</p>
            <h2 className="text-xl font-semibold">{creation.length}</h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center">
            <Sparkle className="w-5 text-white" />
          </div>
        </div>

        {/* Active plan card */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Active Plan</p>
            <h2 className="text-xl font-semibold">
              <Protect plan="premium" fallback="Free">
                Premium
              </Protect>
            </h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center">
            <Gem className="w-5 text-white" />
          </div>
        </div>
      </div>

      {
        loading ?
          (
            <div className='flex justify-center items-center h-3/4'>
              <span className="w-11 h-11 rounded-full border-3 border-purple-500 border-t-transparent animate-spin"></span>
            </div>
          )
          :
          (
            <div className="space-y-3">
              <p className="mt-6 mb-4">Recent Creation</p>
              {creation.map((item) => (
                <CreationItem key={item.id} item={item} />
              ))}
            </div>
          )
      }

    </div>
  );
};

export default Dashboard;
