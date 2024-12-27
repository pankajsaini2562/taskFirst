import React, { useState } from "react";
import axios from "axios";
export default function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !description || !thumbnail || !video) {
      setMessage("All fields are required!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Upload Thumbnail
      const thumbnailFormData = new FormData();
      thumbnailFormData.append("file", thumbnail);
      thumbnailFormData.append("upload_preset", "my_present_name");
      thumbnailFormData.append(
        "context",
        `title=${title}|description=${description}`
      ); // Attach metadata

      const thumbnailResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/ddkiocw2i/image/upload",
        thumbnailFormData
      );

      const thumbnailUrl = thumbnailResponse.data.secure_url;

      // Upload Video
      const videoFormData = new FormData();
      videoFormData.append("file", video);
      videoFormData.append("upload_preset", "my_present_name");
      videoFormData.append(
        "context",
        `title=${title}|description=${description}`
      ); // Attach metadata

      const videoResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/ddkiocw2i/video/upload",
        videoFormData
      );
      const videoUrl = videoResponse.data.secure_url;

      setMessage(
        `Upload Successful! Thumbnail URL: ${thumbnailUrl}, Video URL: ${videoUrl}`
      );
    } catch (error) {
      setMessage("Upload failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-5 border rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Upload Form</h1>
      <form onSubmit={handleUpload}>
        {/* Title */}
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title (50 characters max)
          </label>
          <input
            type="text"
            id="title"
            maxLength="50"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter title"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description (200 characters max)
          </label>
          <textarea
            id="description"
            maxLength="200"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter description"
            rows="3"
          />
        </div>

        {/* Thumbnail */}
        <div className="mb-4">
          <label
            htmlFor="thumbnail"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Thumbnail (JPG, PNG only)
          </label>
          <input
            type="file"
            id="thumbnail"
            accept=".jpg, .png"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="mt-1 block w-full text-sm text-gray-700"
          />
        </div>

        {/* Video */}
        <div className="mb-4">
          <label
            htmlFor="video"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Video (MPG, AVI, MP4 only)
          </label>
          <input
            type="file"
            id="video"
            accept=".mpg, .avi, .mp4"
            onChange={(e) => setVideo(e.target.files[0])}
            className="mt-1 block w-full text-sm text-gray-700"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white font-medium rounded-md shadow ${
              loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Uploading..." : "Submit"}
          </button>
        </div>

        {/* Message */}
        {message && <p className="mt-4 text-sm text-center">{message}</p>}
      </form>
    </div>
  );
}
