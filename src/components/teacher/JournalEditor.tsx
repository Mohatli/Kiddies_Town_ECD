import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Image as ImageIcon, CheckCircle2, Sparkles, Send, Calendar, User, Eye } from 'lucide-react';
import { JournalPost } from '../../types';

interface JournalEditorProps {
  onAddPost?: (post: JournalPost) => Promise<void>;
  posts?: JournalPost[];
}

const PRESET_IMAGES = [
  {
    label: 'Art & Painting',
    url: 'https://images.unsplash.com/photo-1596496050827-8299e0220de1?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Building Blocks',
    url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Outdoor Play',
    url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Storytime & Books',
    url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Science & Discovery',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
  },
];

export default function JournalEditor({ onAddPost, posts = [] }: JournalEditorProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [postedBy, setPostedBy] = useState('Teacher Anne');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please provide a title and classroom activity description.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const newPost: JournalPost = {
      id: `journal-${Date.now()}`,
      title: title.trim(),
      date,
      description: description.trim(),
      imageUrl: imageUrl.trim() || PRESET_IMAGES[0].url,
      postedBy: postedBy.trim() || 'Teacher Anne',
    };

    try {
      if (onAddPost) {
        await onAddPost(newPost);
      }
      setSuccess(true);
      setTitle('');
      setDescription('');
      setTimeout(() => {
        setSuccess(false);
      }, 4000);
    } catch {
      setError('Failed to publish classroom journal post. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Editor Card */}
      <div className="glass-card rounded-3xl p-6 md:p-10 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/3 -translate-y-1/3" />

        <div className="border-b border-indigo-50/50 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold font-mono text-indigo-600 uppercase tracking-widest block mb-1">
                Parent Classroom Moments
              </span>
              <h3 className="font-extrabold text-slate-800 text-xl">Daily Classroom Photo Journal</h3>
              <p className="text-sm text-slate-500 font-medium mt-0.5">
                Capture and publish classroom activities for parent portals in real time.
              </p>
            </div>
          </div>
        </div>

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-bold flex items-center gap-3 shadow-sm"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Classroom journal post published! Parents can now view this in their Classroom Gallery.</span>
          </motion.div>
        )}

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                  Activity / Post Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sensory Water Play & Color Discovery"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-hidden shadow-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-indigo-500" /> Activity Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-hidden shadow-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <User className="w-3 h-3 text-indigo-500" /> Educator / Author
                  </label>
                  <input
                    type="text"
                    value={postedBy}
                    onChange={(e) => setPostedBy(e.target.value)}
                    placeholder="Teacher Anne"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-hidden shadow-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                  Classroom Activity Highlights & Observations
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what the children learned, engaged in, or created today..."
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-hidden shadow-xs resize-none"
                  required
                />
              </div>

              {/* Preset Image Chooser */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-500" /> Choose Activity Photo Theme
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {PRESET_IMAGES.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImageUrl(img.url)}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all p-0.5 cursor-pointer aspect-square ${
                        imageUrl === img.url ? 'border-indigo-600 ring-2 ring-indigo-300' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover rounded-lg" />
                      <span className="absolute bottom-0 inset-x-0 bg-slate-900/70 text-[9px] text-white font-bold py-0.5 text-center truncate px-1">
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                  Or Custom Photo URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:border-indigo-500 transition-all outline-hidden shadow-xs"
                />
              </div>
            </div>

            {/* Live Parent Preview */}
            <div className="space-y-2 flex flex-col">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                <Eye className="w-4 h-4 text-indigo-500" />
                <span>Live Parent Preview</span>
              </div>
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md flex-1 flex flex-col">
                <div className="relative h-48 sm:h-56 bg-slate-100 overflow-hidden">
                  <img
                    src={imageUrl || PRESET_IMAGES[0].url}
                    alt={title || 'Classroom activity'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-extrabold text-indigo-600 shadow-xs">
                    {date}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white shadow-xs">
                    By {postedBy || 'Teacher'}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">
                      {title || 'Activity Title Preview'}
                    </h4>
                    <p className="text-xs text-slate-600 font-medium mt-2 leading-relaxed">
                      {description || 'Activity highlights and teacher notes will be formatted here as viewed by parents in the classroom gallery.'}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-bold">
                    <span>Kiddies Town Academy</span>
                    <span className="text-indigo-600 font-extrabold">ECD Journal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200/80 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Publishing Post...' : 'Publish to Parent Gallery'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Previous Posts Feed */}
      {posts && posts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-800 text-lg">Published Classroom Posts ({posts.length})</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow">
                <div className="h-40 bg-slate-100 relative overflow-hidden">
                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-slate-700">
                    {p.date}
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h5 className="font-bold text-slate-900 text-sm">{p.title}</h5>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{p.description}</p>
                  <p className="text-[10px] font-semibold text-indigo-600 pt-1 border-t border-slate-100">
                    Posted by {p.postedBy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
