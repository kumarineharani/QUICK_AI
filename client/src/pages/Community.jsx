import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useUser } from '@clerk/clerk-react'
// import { dummyPublishedCreationData } from '../assets/assets'
import toast from "react-hot-toast";
import { Heart } from 'lucide-react'
import axios from 'axios';
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([])
  const { user } = useUser()

  const [loading, setLoading] = useState(false)
  const { getToken } = useAuth();

  // Prevent rapid double-clicks
  const likingRef = useRef(new Set());

  const fetchCreations = async (silent = false) => {
    // setCreations(dummyPublishedCreationData)
    try {

      setLoading(true)
      let token = await getToken();
      if (!token) {
        toast.error("Please log in to continue");
        return;
      }

      const { data } = await axios.get('/get-published-creations', {
        headers: { Authorization: `Bearer ${token}` }
      })

      // debugging
      // console.log('API Response:', data);

      if (data.success && data.data.length > 0) {
        // console.log('Data Success : ', data.success)
        setCreations(data.data)
        if (!silent) toast.success(data.message || 'Published creations loaded successfully!');
      }
      else {
        toast.error(data.message || 'Failed to load published creations')
      }

    } catch (error) {
      // console.log('API error:', error);
      toast.error(`Error: ${error.message}`);
    }
    finally {
      setLoading(false);
    }
  }

  const imageLikeToggle = useCallback(async (id) => {

    // Prevent multiple simultaneous requests for the same creation
    if (likingRef.current.has(id)) return;

    // Validate ID
    if (!id) return toast.error('Invalid creation ID');

    likingRef.current.add(id);

    try {
      const token = await getToken();
      if (!token) return toast.error("Please log in to continue");

      // Find the current creation before making changes
      const currentCreation = creations.find(c => c.id === id);
      if (!currentCreation) return toast.error('Creation not found');

      // Save original state for potential rollback
      const originalLikes = [...currentCreation.likes];

      // Calculate optimistic update
      const isCurrentlyLiked = currentCreation.likes.includes(user?.id);
      const optimisticLikes = isCurrentlyLiked
        ? currentCreation.likes.filter(userId => userId !== user?.id)
        : [...currentCreation.likes, user?.id];

      // 1. IMMEDIATE UI UPDATE (Optimistic)
      setCreations((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, likes: optimisticLikes } : c
        )
      );

      // 2. Make API call in background
      const { data } = await axios.post('/toggle-like-creation', { id }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      // Debug
      // console.log('Full server response:', data);

      if (data.success) {
        // 3. Sync with server response (usually matches optimistic update)
        // console.log('Data Success : ', data.success)
        setCreations((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, likes: data.data.likes } : c
          )
        );

        // Show success toast
        const isLiked = data.data.likes.includes(user?.id);
        toast.success(isLiked ? 'Liked Creation!' : 'Like Removed');
      } else {
        // 4. Revert on failure
        setCreations((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, likes: originalLikes } : c
          )
        );

        toast.error(data.message || 'Failed to update like. Please try again.');
        // await fetchCreations(true)
      }

    } catch (error) {
      // 5. Revert on error
      const originalCreation = creations.find(c => c.id === id);
      if (originalCreation) {
        setCreations((prev) =>
         prev.map((c) =>
           c.id === id ? { ...c, likes: originalCreation.likes } : c
         )
       );
      }

      console.log('API error:', error);
      toast.error(`Error: ${error.message}`);
      toast.error('Like action failed, reverted.');
    } finally {
      // Always remove from set when done
      likingRef.current.delete(id);
    }
  }, [creations, user?.id, getToken]
  );

  useEffect(() => {
    if (user) {
      fetchCreations()
    }
  }, [user]) // ✅ added dependency

  return !loading ? (
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      Creations
      <div className="bg-white h-full rounded-xl overflow-y-scroll">
        {creations.map((creation, index) => (
          <div
            key={index}
            className="relative group inline-block pl-3 w-full sm:max-w-1/2 lg:max-w-1/3"
          >
            <img
              src={creation.content}
              alt="creation"
              className="w-full h-full object-cover rounded-lg"
            />
            <div
              className="absolute bottom-0 top-0 right-0 left-0 flex gap-2 items-end justify-end 
              group-hover:justify-between p-3 group-hover:bg-gradient-to-b 
              from-transparent to-black/80 text-white rounded-lg"
            >
              <p className="text-sm hidden group-hover:block">{creation.prompt}</p>
              <div className="flex gap-1 items-center">
                <p>{creation.likes.length}</p>
              {/* <p className="flex gap-1 items-center">{creation.likes.length}</p> */}
              <Heart
                onClick={() => imageLikeToggle(creation.id)}
                className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${creation.likes.includes(user?.id)
                  ? 'fill-red-500 text-red-600'
                  : 'text-white'
                  }`}
              />
            </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className='flex justify-center items-center h-full'>
      <span className="w-10 h-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin"></span>
    </div>
  )
}

export default Community
