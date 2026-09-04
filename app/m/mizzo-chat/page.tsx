// app/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Type, 
  Smile, 
  Image as ImageIcon, 
  Sparkles, 
  Play,
  X,
  ArrowLeft,
  Heart,
  Star,
  PartyPopper,
  Send,
  Trash2,
  Move,
  RotateCw,
  Eye,
  Share2
} from 'lucide-react';

// Types
interface Element {
  id: string;
  type: 'text' | 'emoji' | 'sticker' | 'image';
  content: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  animation?: 'bounce' | 'pulse' | 'shake' | 'pop' | 'slide' | 'none';
  emoji?: string;
  sticker?: string;
  imageUrl?: string;
  fontSize?: number;
  color?: string;
}

interface Scene {
  id: string;
  elements: Element[];
  background: string;
}

// Mock data
const STICKERS = ['❤️', '😂', '🎉', '🔥', '✨', '⭐', '🎁', '💕', '🌈', '🦋', '🌸', '🌺', '💫', '🎀', '🎊', '🎈'];
const EMOJIS = ['😊', '😂', '❤️', '🎉', '✨', '🔥', '💕', '⭐', '🌈', '🦋', '🌸', '🌺', '💫', '🎀', '🎊', '🎈'];
const COLORS = ['#FF6B6B', '#FFA94D', '#FFD93D', '#6BCB77', '#4D96FF', '#9B59B6', '#FF6B9D', '#00C9A7'];
const FONTS = ['Inter', 'Georgia', 'Comic Sans MS', 'Arial', 'Impact'];

export default function Home() {
  const [mode, setMode] = useState<'viewer' | 'editor' | 'preview'>('viewer');
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [currentScene, setCurrentScene] = useState<Scene>({
    id: '1',
    elements: [],
    background: 'from-pink-100 via-purple-100 to-blue-100'
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [showReaction, setShowReaction] = useState<string | null>(null);
  const [showShare, setShowShare] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock initial message
  useEffect(() => {
    setElements([
      {
        id: '1',
        type: 'emoji',
        content: '🎁',
        x: 40,
        y: 20,
        scale: 3,
        rotation: 0,
        animation: 'bounce'
      },
      {
        id: '2',
        type: 'text',
        content: 'I have something',
        x: 20,
        y: 50,
        scale: 1,
        rotation: 0,
        fontSize: 24,
        color: '#4A4A6A'
      },
      {
        id: '3',
        type: 'text',
        content: 'special for you...',
        x: 20,
        y: 60,
        scale: 1,
        rotation: 0,
        fontSize: 20,
        color: '#6C6C8A'
      }
    ]);
  }, []);

  const addElement = (type: Element['type'], content: string, extra?: any) => {
    const newElement: Element = {
      id: Date.now().toString(),
      type,
      content,
      x: 50,
      y: 50,
      scale: type === 'emoji' ? 2 : type === 'sticker' ? 1.5 : 1,
      rotation: 0,
      animation: 'none',
      ...extra
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
    setShowAddMenu(false);
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    setSelectedElement(null);
  };

  const updateElement = (id: string, updates: Partial<Element>) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        addElement('image', 'Image', { imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlay = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 3000);
  };

  const handleReaction = (reaction: string) => {
    setShowReaction(reaction);
    setTimeout(() => setShowReaction(null), 2000);
  };

  const renderElement = (element: Element, preview: boolean = false) => {
    const animationClasses = element.animation === 'bounce' ? 'animate-bounce' :
                           element.animation === 'pulse' ? 'animate-pulse' :
                           element.animation === 'shake' ? 'animate-shake' :
                           element.animation === 'pop' ? 'animate-pop' :
                           element.animation === 'slide' ? 'animate-slide' :
                           '';

    const baseStyle = {
      position: 'absolute' as const,
      left: `${element.x}%`,
      top: `${element.y}%`,
      transform: `translate(-50%, -50%) scale(${element.scale}) rotate(${element.rotation}deg)`,
      cursor: preview ? 'default' : 'pointer',
      zIndex: selectedElement === element.id ? 10 : 1
    };

    const elementContent = () => {
      switch(element.type) {
        case 'text':
          return (
            <div 
              style={{ 
                fontSize: element.fontSize || 20, 
                color: element.color || '#2D2D4A',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                textShadow: '0 2px 10px rgba(0,0,0,0.05)'
              }}
              className="select-none"
            >
              {element.content}
            </div>
          );
        case 'emoji':
          return (
            <div className="text-6xl select-none">
              {element.content}
            </div>
          );
        case 'sticker':
          return (
            <div className="text-5xl select-none">
              {element.sticker || element.content}
            </div>
          );
        case 'image':
          return (
            <img 
              src={element.imageUrl} 
              alt="Uploaded" 
              className="rounded-xl shadow-lg max-w-[200px] max-h-[200px] object-contain"
            />
          );
        default:
          return null;
      }
    };

    return (
      <motion.div
        key={element.id}
        style={baseStyle}
        className={animationClasses}
        onClick={() => !preview && setSelectedElement(element.id)}
        whileHover={!preview ? { scale: 1.05 } : {}}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        {elementContent()}
        
        {selectedElement === element.id && !preview && (
          <div className="absolute -top-8 -right-8 flex gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); deleteElement(element.id); }}
              className="bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:scale-110 transition"
            >
              <Trash2 size={14} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); updateElement(element.id, { rotation: (element.rotation || 0) + 15 }); }}
              className="bg-blue-500 text-white rounded-full p-1.5 shadow-lg hover:scale-110 transition"
            >
              <RotateCw size={14} />
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  // Viewer Mode
  if (mode === 'viewer') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <motion.div 
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100/50 flex items-center justify-between bg-white/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-gray-700">Interactive Message</span>
              </div>
              <button 
                onClick={() => setMode('editor')}
                className="text-sm px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:shadow-lg transition flex items-center gap-2"
              >
                <Sparkles size={14} />
                Create
              </button>
            </div>

            {/* Message Content */}
            <div className="relative min-h-[400px] p-6">
              <div 
                className="relative w-full h-[400px] rounded-2xl bg-gradient-to-br from-pink-50/50 via-purple-50/50 to-blue-50/50 border border-gray-100/30"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, ${currentScene.background})`
                }}
              >
                {/* Elements */}
                {elements.map(el => renderElement(el, true))}

                {/* Play Button */}
                {!isAnimating && (
                  <motion.button
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full shadow-lg flex items-center gap-2 font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePlay}
                  >
                    <Play size={20} fill="white" />
                    Open
                  </motion.button>
                )}

                {/* Animation */}
                <AnimatePresence>
                  {isAnimating && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-2xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        className="text-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <motion.div
                          className="text-8xl mb-4"
                          animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0]
                          }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                        >
                          🎉
                        </motion.div>
                        <motion.p
                          className="text-white text-2xl font-bold"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          Surprise! 🎊
                        </motion.p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Reactions */}
                <AnimatePresence>
                  {showReaction && (
                    <motion.div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl"
                      initial={{ scale: 0, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0, opacity: 0, y: -20 }}
                    >
                      {showReaction}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Reactions Bar */}
              <div className="mt-4 flex justify-center gap-3">
                {['❤️', '😂', '😭', '🔥', '💕'].map(reaction => (
                  <button
                    key={reaction}
                    onClick={() => handleReaction(reaction)}
                    className="text-3xl hover:scale-125 transition-transform p-2 hover:bg-white/50 rounded-full"
                  >
                    {reaction}
                  </button>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="px-6 py-4 border-t border-gray-100/50 bg-white/30 flex justify-between items-center">
              <button
                onClick={() => setShowShare(!showShare)}
                className="text-gray-600 hover:text-gray-900 transition flex items-center gap-2"
              >
                <Share2 size={18} />
                Share
              </button>
              <div className="text-xs text-gray-500">
                Tap to interact ✨
              </div>
            </div>

            {showShare && (
              <motion.div
                className="px-6 py-4 bg-white/50 border-t border-gray-100/50"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value="yourapp.com/e/abc123"
                    readOnly
                    className="flex-1 px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('yourapp.com/e/abc123');
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium"
                  >
                    Copy
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // Editor Mode
  if (mode === 'editor') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Editor Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMode('viewer')}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-semibold text-gray-800">Create Experience</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode('preview')}
              className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium flex items-center gap-2"
            >
              <Eye size={16} />
              Preview
            </button>
            <button
              onClick={() => {
                setMode('viewer');
                handlePlay();
              }}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium flex items-center gap-2"
            >
              <Send size={16} />
              Send
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-4 flex items-center justify-center">
          <div 
            className="relative w-full max-w-md aspect-[9/16] rounded-2xl shadow-xl overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(to bottom right, ${currentScene.background})`
            }}
            ref={containerRef}
          >
            {/* Background color picker */}
            <div className="absolute top-3 left-3 z-10 flex gap-1">
              {['from-pink-100 via-purple-100 to-blue-100', 'from-yellow-100 via-orange-100 to-red-100', 'from-green-100 via-teal-100 to-blue-100', 'from-purple-100 via-indigo-100 to-blue-100'].map((bg, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentScene({ ...currentScene, background: bg })}
                  className={`w-6 h-6 rounded-full border-2 transition ${currentScene.background === bg ? 'border-purple-500 scale-110' : 'border-white/50'}`}
                  style={{ background: `linear-gradient(to bottom right, ${bg})` }}
                />
              ))}
            </div>

            {/* Elements */}
            {elements.map(el => renderElement(el, false))}
          </div>
        </div>

        {/* Editor Controls */}
        <div className="bg-white border-t border-gray-200 px-4 py-3 sticky bottom-0 z-20">
          {/* Selected element controls */}
          {selectedElement && (
            <div className="mb-3 p-3 bg-gray-50 rounded-xl flex items-center gap-3 overflow-x-auto">
              {elements.find(el => el.id === selectedElement)?.type === 'text' && (
                <>
                  <input
                    type="text"
                    value={elements.find(el => el.id === selectedElement)?.content || ''}
                    onChange={(e) => updateElement(selectedElement, { content: e.target.value })}
                    className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
                    placeholder="Type text..."
                  />
                  <select
                    onChange={(e) => updateElement(selectedElement, { color: e.target.value })}
                    className="px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
                  >
                    {COLORS.map(color => (
                      <option key={color} value={color} style={{ color, backgroundColor: color + '20' }}>
                        {color}
                      </option>
                    ))}
                  </select>
                  <select
                    onChange={(e) => updateElement(selectedElement, { fontSize: parseInt(e.target.value) })}
                    className="px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
                  >
                    {[16, 20, 24, 28, 32, 40].map(size => (
                      <option key={size} value={size}>{size}px</option>
                    ))}
                  </select>
                </>
              )}
              {(elements.find(el => el.id === selectedElement)?.type === 'emoji' || 
                elements.find(el => el.id === selectedElement)?.type === 'sticker') && (
                <div className="flex gap-1">
                  {(elements.find(el => el.id === selectedElement)?.type === 'emoji' ? EMOJIS : STICKERS).map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => updateElement(selectedElement, { content: emoji, sticker: emoji })}
                      className="text-2xl p-1 hover:bg-white rounded-lg transition"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
              <select
                onChange={(e) => updateElement(selectedElement, { animation: e.target.value as any })}
                className="px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
              >
                <option value="none">No animation</option>
                <option value="bounce">Bounce</option>
                <option value="pulse">Pulse</option>
                <option value="shake">Shake</option>
                <option value="pop">Pop</option>
                <option value="slide">Slide</option>
              </select>
            </div>
          )}

          {/* Add menu */}
          {!showAddMenu ? (
            <button
              onClick={() => setShowAddMenu(true)}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-purple-400 hover:text-purple-600 transition flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Element
            </button>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => addElement('text', 'Type something...', { fontSize: 24, color: '#2D2D4A' })}
                className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition flex flex-col items-center gap-1"
              >
                <Type size={24} className="text-purple-500" />
                <span className="text-xs font-medium">Text</span>
              </button>
              <button
                onClick={() => addElement('emoji', '❤️')}
                className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition flex flex-col items-center gap-1"
              >
                <Smile size={24} className="text-purple-500" />
                <span className="text-xs font-medium">Emoji</span>
              </button>
              <button
                onClick={() => addElement('sticker', '✨', { sticker: '✨' })}
                className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition flex flex-col items-center gap-1"
              >
                <Sparkles size={24} className="text-purple-500" />
                <span className="text-xs font-medium">Sticker</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition flex flex-col items-center gap-1"
              >
                <ImageIcon size={24} className="text-purple-500" />
                <span className="text-xs font-medium">Image</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => setShowAddMenu(false)}
                className="col-span-4 p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition flex items-center justify-center gap-2 text-gray-600"
              >
                <X size={18} />
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Preview Mode
  if (mode === 'preview') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md aspect-[9/16] rounded-2xl shadow-2xl overflow-hidden">
          <div 
            className="w-full h-full rounded-2xl"
            style={{
              backgroundImage: `linear-gradient(to bottom right, ${currentScene.background})`
            }}
          >
            {elements.map(el => renderElement(el, true))}
            
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
              <button
                onClick={() => setMode('editor')}
                className="px-6 py-2 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium border border-white/30"
              >
                Edit
              </button>
              <button
                onClick={() => setMode('viewer')}
                className="px-6 py-2 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium border border-white/30"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}


