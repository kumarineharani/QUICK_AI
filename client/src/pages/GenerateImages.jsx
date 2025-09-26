import { Image, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {

  const imageStyle = [
    'Realistic',
    'Anime style',
    'Cartoon style',
    'Ghibli style',
    'Fantasy style',
    'Realistic style',
    '3D style',
    'portrait style',
  ];
  
  const [selectedStyle, setSelectedStyle] = useState(imageStyle[0]);
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);

  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('');
  
  const { getToken } = useAuth();
  
  const onSubmitHandler = async (e) => {
    e.preventDefault();

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

      const prompt = `Generate an image of ${input} in the style ${selectedStyle}`;

      const { data } = await axios.post('/ai/generate-image', {
        prompt, publish
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      // debugging
      console.log('API Response:', data);

      if (data.success && data.data.length > 0) {
        console.log('Data Success : ', data.success)
        setContent(data.data[0].content)
        toast.success(data.message || 'Image generated successfully!');
      }
      else {
        toast.error(data.message || 'Failed to generate image')
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
          <Sparkles className="w-6 text-[#00AD25]" />
          <h2 className="text-xl font-semibold">AI Image Generator</h2>
        </div>

        <p className="mt-6 text-sm font-medium">Describe Your Image</p>
        <textarea
          onChange={(e) => setInput(e.target.value)}
          value={input} 
          rows={4}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border"
          placeholder="Describe What you want to see in the image ..."
          required
        />

        <p className="mt-4 text-sm font-medium">Style</p>
        <div className="flex gap-2 mt-2 flex-wrap">
          {imageStyle.map((item) => (
            <span
              onClick={() => setSelectedStyle(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer
                ${
                  selectedStyle === item
                    ? "bg-blue-50 text-green-700 border-green-300"
                    : "text-gray-500 border-gray-300"
                } `}
              key={item}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="my-6 flex items-center gap-2">
          <label className="relative cursor-pointer">
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition"></div>
            <span
              className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full
              transition peer-checked:translate-x-4"
            ></span>
          </label>
          <p className="text-sm">Make This Image Public</p>
        </div>

        <button disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00AD25]
          to-[#04ff50] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-30"
        >
          {loading ? <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span> : <Image className="w-5" />}
          Generate Image
        </button>
      </form>

      {/* right col */}
      <div
        className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border 
       border-gray-200 min-h-96 "
      >
        <div className="flex items-center gap-3">
          <Image className="w-5 h-5 text-[#00AD25]" />
          <h1 className="text-xl font-semibold">Generated Image</h1>
        </div>
        
        {
            !content ? (
              <div className="flex-1 flex justify-center items-center">
                <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
                  <Image className="w-9 h-9" />
                  <p>Enter a topic and click "Generate Image" to get started</p>
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
  )
}

export default GenerateImages;
//2.55.59
