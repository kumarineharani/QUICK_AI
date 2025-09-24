import { Edit, Sparkle } from "lucide-react";
import React, { useState } from "react";
import axios from 'axios';
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: "short (500-800 words)" },
    { length: 1200, text: "Medium (800-1200 words)" },
    { length: 1600, text: "long (1200+ words)" },
  ];

  const [selectedLength, setSelectedLength] = React.useState(articleLength[0]);
  const [input, setInput] = React.useState("");

  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try{
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

      const prompt = `Write an article about ${input} in ${selectedLength.text}`

      const {data} = await axios.post('/ai/generate-article', {prompt, 
        length:selectedLength.length
      }, {
          headers: {Authorization: `Bearer ${token}`}
        })

      // debugging
      console.log('API Response:', data); 

      if(data.success && data.data.length > 0 ){
        console.log('Data Success : ', data.success)
        setContent(data.data[0].content)
        toast.success(data.message || 'Article generated successfully!');
      }
      else{
        toast.error(data.message || 'Failed to generate article')
      }
    } catch(error){
        console.log('API error:', error);
        toast.error(`Error: ${error.message}`);
    } finally {
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
          <Sparkle className="w-6 text-[#4A7AFF]" />
          <h2 className="text-xl font-semibold">Article Configuration</h2>
        </div>

        <p className="mt-6 text-sm font-medium">Article Topic</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border"
          placeholder="The future of artificial intelligence is ..."
          required
        />

        <p className="mt-4 text-sm font-medium">Article Length</p>
        <div className="flex gap-2 mt-2 flex-wrap">
          {articleLength.map((item, index) => (
            <span
              onClick={() => setSelectedLength(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer
                ${
                  selectedLength.text === item.text
                    ? "bg-blue-50 text-blue-700 border-blue-300"
                    : "text-gray-500 border-gray-300"
                } `}
              key={index}
            >
              {item.text}
            </span>
          ))}
        </div>

        <button disabled = {loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#226BFF]
          to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-50"
        >
          {
            loading ? <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
            : <Edit className="w-5" />
          }
          Generate Article
        </button>
      </form>

      {/* right col */}
      <div
        className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border 
       border-gray-200 min-h-96 max-h-[600px]"
      >
        <div className="flex items-center gap-3">
          <Edit className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Generated article</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Edit className="w-9 h-9" />
            <p>Enter a topic and click "Generate Article" to get started</p>
          </div>
        </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
            <div className="whitespace-pre-line leading-relaxed">
              {content}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default WriteArticle;
