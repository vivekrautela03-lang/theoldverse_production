"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Upload, Film, ArrowLeft, ArrowRight, CheckCircle, Sparkles, AlertCircle, Play } from "lucide-react";
import confetti from "canvas-confetti";
import { mutateStore } from "@/lib/supabaseStore";
import { MediaItem } from "@/lib/mockData";

export default function CreatorUploadPortal() {
  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Form inputs
  const [title, setTitle] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [category, setCategory] = useState("Action");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("1h 15m");
  const [posterUrl, setPosterUrl] = useState("https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600");
  const [videoUrl, setVideoUrl] = useState("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4");

  // Output published item
  const [publishedItem, setPublishedItem] = useState<MediaItem | null>(null);

  // Mock File Selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileSize((file.size / (1024 * 1024)).toFixed(1) + " MB");
      setUploadProgress(0);
      setIsUploading(true);
    }
  };

  // Simulate Cloudinary Video Transcoding upload progress
  useEffect(() => {
    if (isUploading && uploadProgress < 100) {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            setStep(2); // Go to step 2 metadata
            return 100;
          }
          return prev + 10;
        });
      }, 250);
      return () => clearInterval(interval);
    }
  }, [isUploading, uploadProgress]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !creatorName.trim() || !description.trim()) {
      alert("Please fill in all details.");
      return;
    }

    const newItem = mutateStore.addMedia({
      title,
      type: "movie",
      category,
      description,
      duration,
      posterUrl,
      bannerUrl: posterUrl,
      videoUrl,
      isOriginal: false,
      isTrending: false,
      creatorName,
      creatorId: `creator-${creatorName.toLowerCase().replace(/\s+/g, "-")}`
    });

    setPublishedItem(newItem);
    setStep(3); // Go to success page

    // Celebratory confetti shower
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#F5A623", "#FF8C32", "#ffffff"]
    });
  };

  return (
    <div className="bg-oldverse-bg min-h-screen pt-24 pb-16 relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-oldverse-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-oldverse-accent-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
        
        {/* Step Indicator Headers */}
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <div>
            <h1 className="font-bebas text-3xl sm:text-5xl text-oldverse-text tracking-wider uppercase leading-none">
              Creator Portal
            </h1>
            <p className="text-oldverse-secondary text-xs font-grotesk tracking-wide uppercase mt-1">
              {step === 1 && "Step 1: Upload Cinema Footage"}
              {step === 2 && "Step 2: Enter Metadata & Synopsis"}
              {step === 3 && "Step 3: Published & Live"}
            </p>
          </div>
          
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-8 rounded-full transition-all duration-300 ${
                  step >= s ? "bg-oldverse-accent" : "bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: DROPZONE FILE SELECTION */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-grotesk text-lg font-bold text-oldverse-text">
                Publish your film. Inspire the world.
              </h2>
              <p className="text-sm font-light text-oldverse-secondary max-w-lg mx-auto">
                Upload your visual creations directly. Supported video types: MP4, MOV, WEBM. Maximum mock size: 5GB.
              </p>
            </div>

            <div className="glassmorphism-card rounded-xl border border-white/10 p-10 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px] relative overflow-hidden">
              {isUploading ? (
                <div className="w-full max-w-xs space-y-4">
                  <div className="h-10 w-10 border-t-2 border-b-2 border-oldverse-accent rounded-full animate-spin mx-auto"></div>
                  <div className="space-y-2">
                    <p className="text-sm font-grotesk font-semibold text-oldverse-text">Transcoding video to Cloudinary servers...</p>
                    <p className="text-xs text-oldverse-secondary">{uploadProgress}% uploaded</p>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-oldverse-accent transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-full bg-oldverse-accent/10 text-oldverse-accent border border-oldverse-accent/20">
                    <Upload className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-grotesk font-bold text-oldverse-text">Drag & drop your video file here</p>
                    <p className="text-xs text-oldverse-secondary font-light">or click to browse your local folder</p>
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </>
              )}
            </div>

            {/* Quick Demo Bypass */}
            {!isUploading && (
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setFileName("demo_short_film.mp4");
                    setFileSize("245.2 MB");
                    setStep(2);
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-oldverse-accent hover:text-oldverse-accent-secondary uppercase tracking-wider cursor-pointer"
                >
                  Skip to Details Form (Use Demo Asset) <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: METADATA FORM */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="bg-oldverse-card border border-white/5 rounded-xl p-6 space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <h3 className="font-grotesk text-sm font-bold uppercase tracking-wider text-oldverse-text">
                Film Registration details
              </h3>
              {fileName && (
                <span className="text-[10px] text-oldverse-secondary bg-white/5 border border-white/5 px-2.5 py-1 rounded">
                  📎 {fileName} ({fileSize})
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-grotesk font-semibold text-oldverse-secondary uppercase">Director / Creator Name</label>
                <input
                  type="text"
                  required
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full text-xs pl-3 pr-3 py-2.5 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text focus:outline-none focus:border-oldverse-accent"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-grotesk font-semibold text-oldverse-secondary uppercase">Film Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Silent Connections"
                  className="w-full text-xs pl-3 pr-3 py-2.5 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text focus:outline-none focus:border-oldverse-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-grotesk font-semibold text-oldverse-secondary uppercase">Genre / Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs pl-3 pr-3 py-2.5 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text focus:outline-none focus:border-oldverse-accent"
                >
                  {["Action", "Romance", "Drama", "Comedy", "Horror", "Documentary", "Animation", "Photography", "Travel", "Experimental"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-grotesk font-semibold text-oldverse-secondary uppercase">Duration</label>
                <input
                  type="text"
                  required
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 1h 24m"
                  className="w-full text-xs pl-3 pr-3 py-2.5 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-grotesk font-semibold text-oldverse-secondary uppercase">Transcoded Asset Url</label>
                <select
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full text-xs pl-3 pr-3 py-2.5 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text focus:outline-none"
                >
                  <option value="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4">Demo Video (Tears of Steel)</option>
                  <option value="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4">Narrative Video (Sintel)</option>
                  <option value="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4">Animation Video (Big Buck Bunny)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-grotesk font-semibold text-oldverse-secondary uppercase">Poster Image (Unsplash URL)</label>
              <input
                type="text"
                required
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                placeholder="Enter Unsplash Image URL..."
                className="w-full text-xs pl-3 pr-3 py-2.5 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text focus:outline-none focus:border-oldverse-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-grotesk font-semibold text-oldverse-secondary uppercase">Synopsis & Storyline</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your story..."
                className="w-full text-xs pl-3 pr-3 py-2.5 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text focus:outline-none focus:border-oldverse-accent resize-none"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-lg border border-white/10 hover:bg-white/5 font-grotesk font-bold uppercase text-xs text-oldverse-text transition-colors"
              >
                Back to Upload
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-lg bg-oldverse-accent hover:bg-oldverse-accent-secondary font-grotesk font-bold uppercase text-xs text-oldverse-bg transition-colors"
              >
                Publish on The OldVerse
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SUCCESS PAGE */}
        {step === 3 && publishedItem && (
          <div className="glassmorphism-card rounded-xl border border-white/10 p-8 flex flex-col items-center text-center space-y-6">
            <div className="p-4 rounded-full bg-oldverse-success/15 border border-oldverse-success/20 text-oldverse-success">
              <CheckCircle className="h-10 w-10" />
            </div>
            
            <div className="space-y-2">
              <h2 className="font-bebas text-3xl sm:text-4xl text-oldverse-text tracking-wider uppercase">
                "{publishedItem.title}" is officially live!
              </h2>
              <p className="text-xs text-oldverse-secondary max-w-md mx-auto leading-relaxed">
                Congratulations! Your film has been successfully processed, transcoded, and published into The OldVerse global catalog. Anyone can now watch it or search for it.
              </p>
            </div>

            {/* Movie card representation */}
            <div className="w-56 aspect-[2/3] rounded-lg overflow-hidden border border-white/5 relative group bg-oldverse-card shadow-2xl">
              <img
                src={publishedItem.posterUrl}
                alt={publishedItem.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-4">
                <span className="text-[9px] uppercase font-grotesk font-semibold text-oldverse-accent block mb-1">
                  {publishedItem.category}
                </span>
                <h4 className="font-grotesk text-xs font-bold text-oldverse-text truncate">{publishedItem.title}</h4>
                <p className="text-[9px] text-oldverse-secondary font-light">Directed by {publishedItem.creatorName}</p>
              </div>
            </div>

            <div className="flex gap-4 w-full max-w-sm pt-2">
              {publishedItem.videoUrl?.includes("instagram.com") ? (
                <a
                  href={publishedItem.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-lg bg-oldverse-accent hover:bg-oldverse-accent-secondary text-oldverse-bg font-grotesk font-bold text-xs uppercase transition-colors text-center"
                >
                  <Play className="h-3.5 w-3.5 fill-oldverse-bg" />
                  Watch Now
                </a>
              ) : (
                <Link
                  href={`/watch/${publishedItem.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-lg bg-oldverse-accent hover:bg-oldverse-accent-secondary text-oldverse-bg font-grotesk font-bold text-xs uppercase transition-colors"
                >
                  <Play className="h-3.5 w-3.5 fill-oldverse-bg" />
                  Watch Now
                </Link>
              )}
              <button
                onClick={() => {
                  setTitle("");
                  setCreatorName("");
                  setDescription("");
                  setFileName("");
                  setStep(1);
                }}
                className="flex-1 py-3 rounded-lg border border-white/10 hover:bg-white/5 text-oldverse-text font-grotesk font-bold text-xs uppercase transition-colors"
              >
                Upload Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
