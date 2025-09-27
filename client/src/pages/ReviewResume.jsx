import { FileText, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import axios from 'axios';
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import FormData from "form-data";
import ReactMarkdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  const [input, setInput] = useState(null);

  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input) {
      alert("Please upload an resume first!");
      return;
    }
    console.log("Uploaded file:", input);
    // Here you can call your background removal API

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
      formData.append('resume', input)

      const { data } = await axios.post('ai/resume-review', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      // debugging
      console.log('API Response:', data);

      if (data.success && data.data.length > 0) {
        console.log('Data Success : ', data.success)
        setContent(data.data[0].content)
        toast.success(data.message || 'Resume reviewed successfully!');
      }
      else {
        toast.error(data.message || 'Failed to review resume')
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
          <Sparkles className="w-6 text-[#00Da83]" />
          <h2 className="text-xl font-semibold">Resume Review</h2>
        </div>

        <p className="mt-6 text-sm font-medium">Upload Resume</p>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept="application/pdf"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          required />

        <p className="text-xs text-gray-500 font-light mt-1">
          Supports pdf resume only
        </p>

        <button disabled={loading}
          type="submit"
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#009bb3]
          to-[#009bb3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-80"
        >
          {loading ? <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
            : <FileText className="w-5" />}

          Review Resume
        </button>
      </form>

      {/* right col */}
      <div
        className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border 
       border-gray-200 min-h-96 max-h-[600px]"
      >
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#00da83]" />
          <h1 className="text-xl font-semibold">Analysis Results</h1>
        </div>

        {
          !content ? (
            <div className="flex-1 flex justify-center items-center">
              <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
                <FileText className="w-9 h-9" />
                <p>Upload an Resume and click "Review Resume " to get started</p>
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
  )
}

export default ReviewResume