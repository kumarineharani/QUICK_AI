import { Hash, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const blogCategories = [
    "General",
    "Technology",
    "Health",
    "Travel",
    "Food",
    "Finance",
    "Lifestyle",
    "Education",
  ];

  const [selectedCategory, setSelectedCategory] = useState(blogCategories['General']);
  const [input, setInput] = useState("");

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

      const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedCategory}`;

      const { data } = await axios.post('/ai/generate-blog-title', {
        prompt
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      // debugging
      console.log('API Response:', data);

      if (data.success && data.data.length > 0) {
        console.log('Data Success : ', data.success)
        setContent(data.data[0].content)
        toast.success(data.message || 'Blog Title generated successfully!');
      }
      else {
        toast.error(data.message || 'Failed to generate blog title')
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
          <Sparkles className="w-6 text-[#8E37EB]" />
          <h2 className="text-xl font-semibold">AI Title Generator</h2>
        </div>

        <p className="mt-6 text-sm font-medium">Keyword</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border"
          placeholder="The future of artificial intelligence is ..."
          required
        />

        <p className="mt-4 text-sm font-medium">Category</p>
        <div className="flex gap-2 mt-2 flex-wrap">
          {blogCategories.map((item) => (
            <span
              onClick={() => setSelectedCategory(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer
                ${selectedCategory === item
                  ? "bg-blue-50 text-purple-700 border-purple-300"
                  : "text-gray-500 border-gray-300"
                } `}
              key={item}
            >
              {item}
            </span>
          ))}
        </div>

        <button disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#C341F6]
          to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-30"
        >
          {loading ? <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span> : <Hash className="w-5" />}
          
          Generate Title
        </button>
      </form>

      {/* right col */}
      <div
        className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border 
       border-gray-200 min-h-96 "
      >
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">Generated title</h1>
        </div>
          {
            !content ? (
              <div className="flex-1 flex justify-center items-center">
                <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
                  <Hash className="w-9 h-9" />
                  <p>Enter a topic and click "Generate titles" to get started</p>
                </div>
              </div>
            ) : (
              <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
                <div className="reset-tw">
                  <ReactMarkdown>
                    {content}
                  </ReactMarkdown>
                </div>
              </div>
            )
          }
        
      </div>
    </div>
  );
};

export default BlogTitles;
