import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard.jsx";
import WriteArticle from "./pages/WriteArticle.jsx";
import BlogTitles from "./pages/BlogTitles.jsx";
import GenerateImages from "./pages/GenerateImages.jsx";
import RemoveBackground from "./pages/RemoveBackground.jsx";
import RemoveObject from "./pages/RemoveObject.jsx";
import ReviewResume from "./pages/ReviewResume.jsx";
import Community from "./pages/Community.jsx";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="write-article" element={<WriteArticle />} />
          <Route path="blog-titles" element={<BlogTitles />} />
          <Route path="generate-images" element={<GenerateImages />} />
          <Route path="remove-background" element={<RemoveBackground />} />
          <Route path="remove-object" element={<RemoveObject />} />
           <Route path="review-resume" element={<ReviewResume />} />
            <Route path="Community" element={<Community />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
