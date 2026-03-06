import React, { useState } from "react";
import { Link } from "react-router-dom";

function BlogList({ blogs, onEdit, onDelete }) {
  const [selectedBlogs, setSelectedBlogs] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  const handleSelectBlog = (blogId) => {
    setSelectedBlogs((prev) =>
      prev.includes(blogId) ? prev.filter((id) => id !== blogId) : [...prev, blogId]
    );
  };

  const handleSelectAll = () => {
    if (selectedBlogs.length === blogs.length) {
      setSelectedBlogs([]);
    } else {
      setSelectedBlogs(blogs.map((blog) => blog._id || blog.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedBlogs.length > 0) {
      selectedBlogs.forEach((blogId) => onDelete(blogId));
      setSelectedBlogs([]);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Blog Posts Found</h3>
        <p className="text-gray-600">Create your first blog post to get started.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">Blog Posts</h2>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            {blogs.length} {blogs.length === 1 ? "post" : "posts"}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Bulk Actions */}
          {selectedBlogs.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{selectedBlogs.length} selected</span>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
              >
                Delete Selected
              </button>
            </div>
          )}

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === "grid"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Select All */}
      <div className="flex items-center mb-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedBlogs.length === blogs.length}
            onChange={handleSelectAll}
            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-600">Select all posts</span>
        </label>
      </div>

      {/* Blog Posts */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id || blog.id}
              className={`bg-white rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${
                selectedBlogs.includes(blog._id || blog.id)
                  ? "border-purple-300 ring-2 ring-purple-100"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {/* Selection Checkbox */}
              <div className="p-4 pb-0">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBlogs.includes(blog._id || blog.id)}
                    onChange={() => handleSelectBlog(blog._id || blog.id)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-600">Select</span>
                </label>
              </div>

              {/* Featured Image */}
              {blog.featuredImage && (
                <div className="px-4 pb-4">
                  <img
                    src={blog.featuredImage || "/placeholder.svg"}
                    alt={blog.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-4 pt-0">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 flex-1">{blog.title}</h3>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      blog.status || "published"
                    )}`}
                  >
                    {blog.status || "Published"}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {blog.metaDescription || "No description available."}
                </p>

                {/* Meta Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-xs text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z"
                      />
                    </svg>
                    {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}
                    {blog.author && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{blog.author}</span>
                      </>
                    )}
                  </div>

                  {blog.categories && blog.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {blog.categories.slice(0, 2).map((category, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                        >
                          {typeof category === "object" ? category.name : category}
                        </span>
                      ))}
                      {blog.categories.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          +{blog.categories.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {blog.keywords && blog.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {blog.keywords.slice(0, 3).map((keyword, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <Link
                    to={`/blogs/${blog.slug}`}
                    target="_blank"
                    className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-colors"
                    title="View Post"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <span className="text-sm">View</span>
                  </Link>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(blog)}
                      className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                      title="Edit Post"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <span className="text-sm">Edit</span>
                    </button>

                    <button
                      onClick={() => onDelete(blog._id)}
                      className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                      title="Delete Post"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span className="text-sm">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div
              key={blog._id || blog.id}
              className={`bg-white rounded-xl shadow-sm border p-6 transition-all duration-200 hover:shadow-md ${
                selectedBlogs.includes(blog._id || blog.id)
                  ? "border-purple-300 ring-2 ring-purple-100"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Selection Checkbox */}
                <label className="flex items-center mt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBlogs.includes(blog._id || blog.id)}
                    onChange={() => handleSelectBlog(blog._id || blog.id)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                </label>

                {/* Featured Image */}
                {blog.featuredImage && (
                  <img
                    src={blog.featuredImage || "/placeholder.svg"}
                    alt={blog.title}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{blog.title}</h3>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        blog.status || "published"
                      )}`}
                    >
                      {blog.status || "Published"}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {blog.metaDescription || "No description available."}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</span>
                      {blog.author && <span>{blog.author}</span>}
                      {blog.categories && blog.categories.length > 0 && (
                        <span>
                          {blog.categories
                            .slice(0, 2)
                            .map((cat) => (typeof cat === "object" ? cat.name : cat))
                            .join(", ")}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/blogs/${blog.slug}`}
                        target="_blank"
                        className="text-gray-600 hover:text-purple-600 transition-colors"
                        title="View Post"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </Link>

                      <button
                        onClick={() => onEdit(blog)}
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                        title="Edit Post"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={() => onDelete(blog._id)}
                        className="text-gray-600 hover:text-red-600 transition-colors"
                        title="Delete Post"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BlogList;