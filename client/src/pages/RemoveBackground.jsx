import { Eraser, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from 'axios';
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import FormData from "form-data";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {
  const [input, setInput] = useState(null);

  
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('');
  
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input) {
      alert("Please upload an image first!");
      return;
    }
    console.log("Uploaded file:", input);

    try {
      setLoading(true)

      // Handle potential auth token issues
      let token;
      try {
        token = await getToken();
        if (!token) {
          toast.error('Please log in to continue');
          return;
        }
      } catch (authError) {
        console.log('Auth error:', authError);
        toast.error('Authentication failed. Please check your internet connection and try logging in again.');
        return;
      }

      const formData = new FormData()
      formData.append('image', input)

      const { data } = await axios.post('ai/remove-image-background', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      // debugging
      console.log('API Response:', data);

      if (data.success && data.data.length > 0) {
        console.log('Data Success : ', data.success)
        setContent(data.data[0].content)
        toast.success(data.message || 'Image background removed successfully!');
      }
      else {
        toast.error(data.message || 'Failed to remove image background')
      }

    } catch (error) {
      console.log('API error:', error);
      toast.error(`Error: ${error.message}`);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* left col */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#FF4938]" />
          <h2 className="text-xl font-semibold">Background Removal</h2>
        </div>

        <p className="mt-6 text-sm font-medium">Upload Image</p>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept="image/*"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
        />

        <p className="text-xs text-gray-500 font-light mt-1">
          Supports JPG, PNG and other image formats
        </p>

        <button disabled={loading}
          type="submit"
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#F6A841]
          to-[#ff4938] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-30"
        >
          {loading ? <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span> : <Eraser className="w-5" />}
          
          Remove Background
        </button>
      </form>

      {/* right col */}
      <div
        className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border 
       border-gray-200 min-h-96"
      >
        <div className="flex items-center gap-3">
          <Eraser className="w-5 h-5 text-[#ff4938]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>

        {
            !content ? (
              <div className="flex-1 flex justify-center items-center">
                <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
                  <Eraser className="w-9 h-9" />
                  <p>Upload an image and click "Remove Background" to get started</p>
                </div>
              </div>
            ) : (
              <div className="mt-3 h-full">
                <img src={content} alt='image' className='h-full w-full' />
              </div>
            )
          }
        
      </div>
    </div>
  );
};

export default RemoveBackground;
