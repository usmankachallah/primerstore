
import React, { useMemo, useState, useEffect } from 'react';
import { X, ShoppingBag, Star, ShieldCheck, Zap, Heart, Minus, Plus, Bot, Sparkles, Box, Camera, Smartphone, Layers, HelpCircle, Info, Move3d, Maximize, ChevronDown, ChevronUp, Cpu, Settings2, Activity } from 'lucide-react';
import { Product, User } from '../types';
import { getAIRecommendations } from '../geminiService';

interface ProductModalProps {
  product: Product | null;
  allProducts: Product[];
  user: User | null;
  wishlist: string[];
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedVariants?: Record<string, string>) => void;
  onSelectProduct: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
}

// Typed alias for model-viewer to bypass intrinsic element errors in JSX
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
  const [isScanning, setIsScanning] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const isWishlisted = product ? wishlist.includes(product.id) : false;

  // Initialize selected variants
  useEffect(() => {
    if (product?.variants) {
      const initial: Record<string, string> = {};
      product.variants.forEach(v => {
        initial[v.name] = v.options[0].id;
      });
      setSelectedVariants(initial);
    } else {
      setSelectedVariants({});
    }
  }, [product?.id]);

  const dynamicPricing = useMemo(() => {
    if (!product) return { price: 0, stock: 0 };
    let totalModifier = 0;
    let stockMod = 0;
    
    if (product.variants) {
      product.variants.forEach(v => {
        const selectedId = selectedVariants[v.name];
        const option = v.options.find(o => o.id === selectedId);
        if (option) {
          totalModifier += option.priceModifier || 0;
          stockMod += option.stockModifier || 0;
        }
      });
    }
    
    return {
      price: product.price + totalModifier,
      stock: Math.max(0, product.stock + stockMod)
    };
  }, [product, selectedVariants]);

  // Simulate products frequently added to cart together
  const viewedTogether = useMemo(() => {
    if (!product) return [];
    const aiRecIds = aiRecs.map(r => r.id);
    return allProducts
      .filter(p => p.id !== product.id && !aiRecIds.includes(p.id))
      // Prioritize same category, then randomize others
      .sort((a, b) => {
        if (a.category === product.category && b.category !== product.category) return -1;
        if (a.category !== product.category && b.category === product.category) return 1;
        return 0.5 - Math.random();
      })
      .slice(0, 4);
  }, [product, allProducts, aiRecs]);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setShowAR(false);
      setIsScanning(false);
      setIsSpecsOpen(false);
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

  const handleEnter3D = () => {
    setIsScanning(true);
    // Simulate a neural scan
    setTimeout(() => {
      setIsScanning(false);
      setShowAR(true);
    }, 1500);
  };

  if (!product) return null;

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(dynamicPricing.stock, prev + delta)));
  };

  const handleVariantChange = (category: string, optionId: string) => {
    setSelectedVariants(prev => ({ ...prev, [category]: optionId }));
    setQuantity(1); // Reset quantity on variant change to avoid stock overflow
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
          className="absolute top-6 right-6 z-[110] p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image / 3D Viewer Section */}
        <div className="md:w-5/12 relative bg-[#010409] aspect-square md:aspect-auto flex flex-col items-center justify-center overflow-hidden">
          {isScanning && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#020617]/60 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full animate-ping" />
                <div className="absolute inset-2 border border-cyan-500/40 rounded-full animate-spin duration-[2000ms]" />
                <div className="absolute inset-0 border-t-4 border-cyan-500 rounded-full animate-spin" />
                <Camera className="w-12 h-12 text-cyan-400 animate-pulse" />
                <div className="absolute w-full h-0.5 bg-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.5)] top-1/2 -translate-y-1/2 animate-[bounce_2s_infinite]" />
              </div>
              <p className="mt-8 text-[11px] font-black uppercase tracking-[0.4em] text-cyan-400 animate-pulse">
                Analyzing Mesh Integrity...
              </p>
            </div>
          )}

          {showAR && product.arModel ? (
            <div className="w-full h-full relative group animate-in fade-in duration-1000">
              <ModelViewer
                src={product.arModel}
                ar
                ar-modes="webxr scene-viewer quick-look"
                camera-controls
                auto-rotate
                shadow-intensity="1"
                exposure="1"
                environment-image="neutral"
                className="w-full h-full"
                style={{ '--progress-bar-color': '#06b6d4', width: '100%', height: '100%' }}
              >
                <div slot="poster" className="absolute inset-0 flex items-center justify-center bg-[#010409]">
                   <div className="animate-pulse text-cyan-500/50">CALIBRATING SPATIAL GRID...</div>
                </div>
                
                <button 
                  slot="ar-button" 
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-cyan-400/50 shadow-[0_0_25px_rgba(34,211,238,0.3)] flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 z-40"
                >
                  <Smartphone className="w-5 h-5" />
                  Project into Sector
                </button>
              </ModelViewer>
              
              <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                <button 
                  onClick={() => setShowAR(false)}
                  className="p-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-white text-[10px] font-bold px-4 py-2 flex items-center gap-2 hover:bg-black/60 transition-colors"
                >
                  <X className="w-3 h-3" /> DISCONNECT LINK
                </button>
                <div className="px-3 py-1.5 glass rounded-lg border border-cyan-500/20 text-[9px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
                  Live Spatial Stream
                </div>
              </div>

              {/* Manipulation Guide Tooltip */}
              <div className="absolute bottom-6 right-6 z-20">
                <div className="relative group">
                  <div className="absolute bottom-full right-0 mb-3 w-48 glass p-4 rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 pointer-events-none">
                    <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-2">Spatial Control</p>
                    <ul className="space-y-2 text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                      <li className="flex items-center gap-2"><Move3d className="w-3 h-3 text-white" /> Drag to Rotate</li>
                      <li className="flex items-center gap-2"><Maximize className="w-3 h-3 text-white" /> Pinch to Scale</li>
                      <li className="flex items-center gap-2"><Info className="w-3 h-3 text-white" /> Double tap to Reset</li>
                    </ul>
                  </div>
                  <button className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-cyan-600/20 transition-all">
                    <HelpCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full relative overflow-hidden group">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-8 left-8 right-8 flex flex-col gap-4 animate-in slide-in-from-bottom-6 duration-700">
                <span className="w-fit bg-cyan-500/10 backdrop-blur-md border border-cyan-500/30 px-3 py-1 rounded-full text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                  {product.category} Segment
                </span>
                
                {product.arModel && (
                  <div className="relative group/ar-btn">
                    <button 
                      onClick={handleEnter3D}
                      className="w-full flex items-center justify-center gap-4 bg-white/5 hover:bg-cyan-600/20 backdrop-blur-md border border-cyan-500/30 px-6 py-4 rounded-2xl text-[12px] font-black text-white uppercase tracking-widest transition-all shadow-lg hover:shadow-cyan-500/20"
                    >
                      <div className="relative">
                        <Box className="w-5 h-5 text-cyan-400 group-hover/ar-btn:scale-110 transition-transform" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                      </div>
                      Enter Spatial Reality (3D/AR)
                    </button>
                    
                    {/* AR Guide Hint */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 glass p-4 rounded-2xl border border-cyan-500/20 opacity-0 group-hover/ar-btn:opacity-100 transition-all transform translate-y-2 group-hover/ar-btn:translate-y-0 pointer-events-none text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Smartphone className="w-4 h-4 text-cyan-400" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">AR Protocol</span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase leading-relaxed tracking-tight">
                        Project this unit into your physical environment. Supports WebXR & Android/iOS Scene Viewer.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="md:w-7/12 p-8 md:p-12 flex flex-col overflow-y-auto bg-gradient-to-br from-transparent to-[#0f172a]/40 scrollbar-hide">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < 4 ? 'text-yellow-500 fill-yellow-500' : 'text-slate-700'}`} />
                ))}
              </div>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Approved Protocol • 4.9 Rating</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black mb-6 gradient-text leading-tight tracking-tighter">
              {product.name}
            </h2>
            
            <div className="mb-10">
              <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8 font-medium">
                {product.description}
              </p>
              
              {/* Unit Specifications Collapsible */}
              {product.techSpecs && (
                <div className="mb-10">
                  <button 
                    onClick={() => setIsSpecsOpen(!isSpecsOpen)}
                    className="w-full flex items-center justify-between p-5 glass rounded-2xl border border-white/5 hover:bg-white/5 transition-colors group/specs"
                  >
                    <div className="flex items-center gap-3">
                      <Cpu className="w-4 h-4 text-cyan-400" />
                      <span className="text-[11px] font-black uppercase tracking-[0.2em]">Unit Specifications</span>
                    </div>
                    {isSpecsOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </button>
                  
                  {isSpecsOpen && (
                    <div className="mt-4 p-6 glass rounded-2xl border border-white/5 animate-in slide-in-from-top-2 duration-300">
                      <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                        {Object.entries(product.techSpecs).map(([key, value]) => (
                          <div key={key}>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{key}</p>
                            <p className="text-[11px] font-black text-white">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="p-8 glass rounded-[2.5rem] border border-white/5 flex flex-col lg:flex-row gap-10 items-center mb-10 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/5 to-transparent opacity-50" />
                <div className="text-center lg:border-r lg:border-white/10 lg:pr-10 z-10 shrink-0">
                  <div className="text-5xl font-black text-white mb-2 tracking-tighter">4.9</div>
                  <div className="flex items-center justify-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
                    ))}
                  </div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">User Telemetry</div>
                </div>

                <div className="flex-1 w-full space-y-3 z-10">
                  {[
                    { label: 'Neural Sync', value: 98, color: 'bg-cyan-400' },
                    { label: 'Core Integrity', value: 92, color: 'bg-blue-400' },
                    { label: 'Thermal Shield', value: 85, color: 'bg-purple-400' },
                  ].map((stat) => (
                    <div key={stat.label} className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span>{stat.label}</span>
                        <span className="text-white">{stat.value}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${stat.color} opacity-70 rounded-full transition-all duration-1000`} 
                          style={{ width: `${stat.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-white/5 rounded-2xl p-5 border border-white/5 flex items-center gap-4 hover:border-cyan-500/20 transition-colors group">
                <ShieldCheck className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nexus Guard</p>
                  <p className="text-[11px] font-black">Lifetime Warranty</p>
                </div>
              </div>
              <div className="bg-white/5 rounded-2xl p-5 border border-white/5 flex items-center gap-4 hover:border-purple-500/20 transition-colors group">
                <Zap className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Transmission</p>
                  <p className="text-[11px] font-black">Quantum Delivery</p>
                </div>
              </div>
            </div>

            <div className="mb-12 p-8 bg-purple-500/5 rounded-[3rem] border border-purple-500/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all duration-700">
                <Bot className="w-32 h-32 text-purple-400 rotate-12" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[11px] font-black text-purple-400 uppercase tracking-[0.3em] flex items-center gap-3">
                    <span className="w-1 h-1 bg-purple-500 rounded-full animate-pulse" />
                    Zenith Intelligent Pairings
                  </h3>
                  <div className="text-[9px] font-black bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/20 tracking-widest uppercase">
                    Core Match Found
                  </div>
                </div>

                {isLoadingRecs ? (
                  <div className="flex gap-4 py-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="min-w-[140px] h-40 bg-white/5 rounded-2xl animate-pulse" />
                    ))}
                  </div>
                ) : aiRecs.length > 0 ? (
                  <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
                    {aiRecs.map(rp => (
                      <div 
                        key={rp.id}
                        onClick={() => onSelectProduct(rp)}
                        className="min-w-[160px] group/rec cursor-pointer glass p-4 rounded-3xl border border-white/5 hover:border-purple-500/50 transition-all hover:-translate-y-2"
                      >
                        <div className="aspect-square rounded-2xl overflow-hidden mb-4">
                          <img src={rp.image} alt={rp.name} className="w-full h-full object-cover group-hover/rec:scale-110 transition-transform duration-700" />
                        </div>
                        <h4 className="text-[11px] font-black truncate mb-1 group-hover/rec:text-purple-400 transition-colors uppercase tracking-tight">{rp.name}</h4>
                        <p className="text-[12px] font-black text-slate-400 tracking-tighter">${rp.price}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 italic font-medium">Calibrating next-gen recommendations for your profile...</p>
                )}
              </div>
            </div>

            {/* Viewed Together Section */}
            <div className="mb-12 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
              <div className="flex items-center justify-between mb-6 px-2">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Frequently Synced Modules
                </h3>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                   <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Sector Data Match</span>
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {viewedTogether.map(p => (
                  <div 
                    key={p.id}
                    onClick={() => onSelectProduct(p)}
                    className="glass p-3 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer group/vt"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden mb-3">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover/vt:scale-110 transition-transform duration-500" />
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-tight truncate mb-1 group-hover/vt:text-cyan-400 transition-colors">{p.name}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-slate-400 tracking-tighter">${p.price}</span>
                      <Plus className="w-3.5 h-3.5 text-slate-600 group-hover/vt:text-cyan-400 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 mb-12">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className={`text-[12px] font-black uppercase tracking-widest ${dynamicPricing.stock < 10 ? 'text-red-400' : 'text-green-400'}`}>
                {dynamicPricing.stock} units identified in sector grid
              </span>
            </div>
          </div>

          <div className="mt-auto flex flex-col lg:flex-row items-end justify-between gap-10 pt-10 border-t border-white/10">
            <div className="flex flex-col">
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">Authorization Fee</p>
              <p className="text-5xl font-black tracking-tighter text-white">${dynamicPricing.price}</p>
            </div>
            
            <div className="flex-1 w-full flex flex-col gap-6">
              {/* Variant Selectors Section */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Settings2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Hardware Configuration</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {product.variants.map((variant) => {
                      const currentOptionId = selectedVariants[variant.name];
                      const currentOption = variant.options.find(o => o.id === currentOptionId);
                      const currentStock = Math.max(0, product.stock + (currentOption?.stockModifier || 0));

                      return (
                        <div key={variant.name} className="space-y-2">
                          <div className="relative group/sel">
                            <select 
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-xs font-bold focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer transition-all hover:bg-white/10 pr-10"
                              value={currentOptionId}
                              onChange={(e) => handleVariantChange(variant.name, e.target.value)}
                            >
                              {variant.options.map(opt => (
                                <option key={opt.id} value={opt.id} className="bg-[#020617] text-white py-2">
                                  {opt.name} {opt.priceModifier ? `(+${opt.priceModifier} credits)` : ''}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none group-hover/sel:text-cyan-400 transition-colors" />
                          </div>
                          
                          {/* Individual Variant Stock Display */}
                          <div className="flex items-center justify-between px-1 animate-in fade-in slide-in-from-top-1 duration-300">
                             <div className="flex items-center gap-1.5">
                               <Activity className={`w-2.5 h-2.5 ${currentStock < 10 ? 'text-rose-400' : 'text-cyan-500/50'}`} />
                               <span className="text-[9px] font-black text-slate-500 uppercase tracking-tight">Configuration Stock</span>
                             </div>
                             <span className={`text-[9px] font-black uppercase tracking-widest ${currentStock < 10 ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`}>
                               {currentStock} Units
                             </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap sm:flex-nowrap gap-5 items-center">
                <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-2 gap-3">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <div className="w-10 text-center font-black text-xl">
                    {quantity}
                  </div>
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors disabled:opacity-30"
                    disabled={quantity >= dynamicPricing.stock}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 flex gap-4">
                  {user && (
                    <button 
                      onClick={() => onToggleWishlist(product.id)}
                      className={`p-5 rounded-2xl border transition-all flex items-center justify-center group ${
                        isWishlisted 
                        ? 'bg-rose-500/10 border-rose-500/50 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.2)]' 
                        : 'glass border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-400/50'
                      }`}
                    >
                      <Heart className={`w-7 h-7 transition-transform group-hover:scale-110 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                  )}
                  
                  <button 
                    onClick={() => {
                      onAddToCart(product, quantity, selectedVariants);
                      onClose();
                    }}
                    className="flex-1 py-5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black transition-all shadow-[0_0_30px_rgba(34,211,238,0.3)] flex items-center justify-center gap-4 group active:scale-95"
                  >
                    <ShoppingBag className="w-6 h-6 transition-transform group-hover:rotate-12" />
                    ACQUIRE HARDWARE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
