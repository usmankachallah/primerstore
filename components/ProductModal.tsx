
import React, { useMemo, useState, useEffect } from 'react';
import { X, ShoppingBag, Star, StarHalf, ShieldCheck, Zap, Package, Heart, Minus, Plus, Bot, Sparkles, Box, Maximize, BarChart3 } from 'lucide-react';
import { Product, User } from '../types';
import { getAIRecommendations } from '../services/geminiService';

interface ProductModalProps {
  product: Product | null;
  allProducts: Product[];
  user: User | null;
  wishlist: string[];
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onSelectProduct: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
}

// Fix for model-viewer custom element typing in JSX by defining a typed alias.
const ModelViewer = 'model-viewer' as any;

const ProductModal: React.FC<ProductModalProps> = ({ 
  product, 
  allProducts, 
  user,
  wishlist,
  onClose, 
  onAddToCart, 
  onSelectProduct,
  onToggleWishlist
}) => {
  const [quantity, setQuantity] = useState(1);
  const [aiRecs, setAiRecs] = useState<Product[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);
  const [showAR, setShowAR] = useState(false);

  const isWishlisted = product ? wishlist.includes(product.id) : false;

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product, allProducts]);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setShowAR(false);
      fetchRecommendations();
    }
  }, [product?.id]);

  const fetchRecommendations = async () => {
    if (!product) return;
    setIsLoadingRecs(true);
    const recs = await getAIRecommendations(product, allProducts, wishlist);
    setAiRecs(recs);
    setIsLoadingRecs(false);
  };

  if (!product) return null;

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(product.stock, prev + delta)));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-6xl glass rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Section */}
        <div className="md:w-5/12 relative bg-white/5 aspect-square md:aspect-auto">
          {showAR && product.arModel ? (
            <div className="w-full h-full relative group">
              {/* Fix: Using ModelViewer alias to avoid intrinsic element type errors */}
              <ModelViewer
                src={product.arModel}
                ar
                ar-modes="webxr scene-viewer quick-look"
                camera-controls
                auto-rotate
                shadow-intensity="1"
                className="w-full h-full"
              >
                <button slot="ar-button" className="absolute bottom-6 right-6 bg-cyan-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-cyan-400/50 shadow-lg shadow-cyan-500/20">
                  Activate AR Overlay
                </button>
              </ModelViewer>
              <button 
                onClick={() => setShowAR(false)}
                className="absolute top-6 left-6 z-20 p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white text-[10px] font-bold px-3 py-1.5 flex items-center gap-2"
              >
                <Maximize className="w-3 h-3 rotate-45" /> EXIT 3D MODE
              </button>
            </div>
          ) : (
            <>
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/60 to-transparent pointer-events-none md:hidden" />
              
              <div className="absolute bottom-6 left-6 flex flex-col gap-2">
                <span className="w-fit bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 px-3 py-1 rounded-full text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                  {product.category}
                </span>
                
                {product.arModel && (
                  <button 
                    onClick={() => setShowAR(true)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest transition-all group/ar"
                  >
                    <Box className="w-4 h-4 text-cyan-400 group-hover/ar:rotate-12 transition-transform" />
                    View in Neural AR
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Product Info Section */}
        <div className="md:w-7/12 p-8 md:p-10 flex flex-col overflow-y-auto">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < 4 ? 'text-yellow-500 fill-yellow-500' : 'text-slate-600'}`} />
                ))}
              </div>
              <span className="text-[10px] text-slate-500 font-bold">4.9 (124 reviews)</span>
            </div>
            
            <h2 className="text-3xl font-black mb-3 gradient-text leading-tight">
              {product.name}
            </h2>
            
            <div className="mb-6">
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {product.description}
              </p>
              
              {/* Star Rating System Section */}
              <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 flex flex-col md:flex-row gap-8 items-center mb-8">
                <div className="text-center md:border-r md:border-white/10 md:pr-8">
                  <div className="text-4xl font-black text-white mb-1">4.5</div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                    ))}
                    <StarHalf className="w-4 h-4 text-yellow-500 fill-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                  </div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Rating</div>
                </div>

                <div className="flex-1 w-full space-y-2">
                  {[
                    { stars: 5, percent: 78 },
                    { stars: 4, percent: 15 },
                    { stars: 3, percent: 4 },
                    { stars: 2, percent: 2 },
                    { stars: 1, percent: 1 },
                  ].map((row) => (
                    <div key={row.stars} className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-slate-500 w-2">{row.stars}</span>
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cyan-500/50 rounded-full" 
                          style={{ width: `${row.percent}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-bold text-slate-600 w-6">{row.percent}%</span>
                    </div>
                  ))}
                  <div className="pt-2 flex items-center gap-2 text-[9px] text-slate-500 font-bold uppercase tracking-tight">
                    <BarChart3 className="w-3 h-3 text-cyan-400" />
                    Synchronized with 482 telemetry logs
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase">Warranty</p>
                  <p className="text-[11px] font-bold">2 Year Neural</p>
                </div>
              </div>
              <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex items-center gap-3">
                <Zap className="w-4 h-4 text-purple-400" />
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase">Processing</p>
                  <p className="text-[11px] font-bold">Quantum Core</p>
                </div>
              </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
              <div className="mb-10">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Package className="w-3.5 h-3.5" /> Synchronized Hardware
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {relatedProducts.map(rp => (
                    <div 
                      key={rp.id}
                      onClick={() => onSelectProduct(rp)}
                      className="min-w-[140px] group/item cursor-pointer glass p-2 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all hover:-translate-y-1"
                    >
                      <div className="aspect-square rounded-xl overflow-hidden mb-2">
                        <img src={rp.image} alt={rp.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                      </div>
                      <h4 className="text-[11px] font-bold truncate mb-1 group-hover/item:text-cyan-400 transition-colors">{rp.name}</h4>
                      <p className="text-[10px] font-black text-slate-400">${rp.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Recommendations Section */}
            <div className="mb-8 p-6 bg-purple-500/5 rounded-[2rem] border border-purple-500/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Bot className="w-16 h-16 text-purple-400" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="relative">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    </span>
                    AI Recommended For You
                  </h3>
                  <span className="text-[8px] font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/20">
                    ZENITH INTELLIGENCE
                  </span>
                </div>

                {isLoadingRecs ? (
                  <div className="flex gap-4 py-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="min-w-[120px] h-32 bg-white/5 rounded-2xl animate-pulse" />
                    ))}
                  </div>
                ) : aiRecs.length > 0 ? (
                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {aiRecs.map(rp => (
                      <div 
                        key={rp.id}
                        onClick={() => onSelectProduct(rp)}
                        className="min-w-[130px] group/rec cursor-pointer glass p-2 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all hover:-translate-y-1"
                      >
                        <div className="aspect-square rounded-xl overflow-hidden mb-2">
                          <img src={rp.image} alt={rp.name} className="w-full h-full object-cover group-hover/rec:scale-110 transition-transform duration-500" />
                        </div>
                        <h4 className="text-[10px] font-black truncate mb-1 group-hover/rec:text-purple-400 transition-colors">{rp.name}</h4>
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black text-slate-400">${rp.price}</p>
                          <span className="text-[8px] text-purple-400/70 font-bold uppercase">{rp.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-500 italic">Recalibrating neural filters for your profile...</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className={`text-[10px] font-bold ${product.stock < 10 ? 'text-red-400' : 'text-green-400'}`}>
                {product.stock} units currently in distribution grid
              </span>
            </div>
          </div>

          <div className="mt-auto flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10">
            <div className="flex flex-col">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Price Unit</p>
              <p className="text-3xl font-black">${product.price}</p>
            </div>
            
            <div className="flex-1 w-full flex flex-wrap sm:flex-nowrap gap-3 items-center">
              {/* Quantity Selector */}
              <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-1 gap-1">
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors disabled:opacity-30"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="w-10 text-center font-bold text-sm">
                  {quantity}
                </div>
                <button 
                  onClick={() => handleQuantityChange(1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors disabled:opacity-30"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 flex gap-2">
                {user && (
                  <button 
                    onClick={() => onToggleWishlist(product.id)}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-center group ${
                      isWishlisted 
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-500' 
                      : 'glass border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-400/50'
                    }`}
                    title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <Heart className={`w-5 h-5 transition-transform group-hover:scale-110 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                )}
                
                <button 
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-3 group"
                >
                  <ShoppingBag className="w-4 h-4 transition-transform group-hover:rotate-12" />
                  Acquire Item
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
