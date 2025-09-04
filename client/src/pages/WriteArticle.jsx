import { Sparkle } from "lucide-react";
import React from "react";

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: "short (500-800 words)" },
    { length: 1200, text: "Medium (800-1200 words)" },
    { length: 1600, text: "long (1200+ words)" },
  ];

  const [selectedLength, setSelectedLength] = React.useState(articleLength[0]);
  const [input, setInput] = React.useState("");

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* left col */}
      <form className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <Sparkle className="w-6 text-[#4A7AFF]" />
          <h2 className="text-xl font-semibold">Article Configuration</h2>
        </div>

        <p className="mt-6 text-sm font-medium">Article Topic</p>
        <input
          type="text"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border"
          placeholder="The future of artificial intelligence is ..."
          required
        />

        <p className="mt-4 text-sm font-medium">Article Length</p>
        <div>
          {articleLength.map((item, index) => (
            <span
              onClick={() => setSelectedLength(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer
                 ${selectedLength.text === item.text ? 'bg-blue-50 texr-blue700' : 'text-gray-500 border-gray-300'} `}
              key={index}
            >
              {item.text}
            </span>
          ))}
        </div>
      </form>

      {/* right col */}
      <div>{/* future content */}</div>
    </div>
  );
};

export default WriteArticle;
