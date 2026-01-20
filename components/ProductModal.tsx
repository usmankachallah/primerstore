import React, { useMemo, useState } from 'react';
import { X, ShoppingBag, Star, ShieldCheck, Zap, Package, Heart, Minus, Plus } from 'lucide-react';
import { Product, User } from '../types';

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

  const isWishlisted = product ? wishlist.includes(product.id) : false;

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product, allProducts]);

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
          className="absolute top-6 right-6 z-10 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Section */}
        <div className="md:w-5/12 relative bg-white/5 aspect-square md:aspect-auto">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/60 to-transparent pointer-events-none md:hidden" />
          
          <div className="absolute bottom-6 left-6 flex gap-2 pointer-events-none">
            <span className="bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 px-3 py-1 rounded-full text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
              {product.category}
            </span>
          </div>
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
            
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {product.description}
            </p>

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
              <div className="mb-8">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Package className="w-3.5 h-3.5" /> Synchronized Hardware
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {relatedProducts.map(rp => (
                    <div 
                      key={rp.id}
                      onClick={() => {
                        setQuantity(1);
                        onSelectProduct(rp);
                      }}
                      className="min-w-[140px] group/item cursor-pointer glass p-2 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all hover:-translate-y-1"
                    >
                      <div className="aspect-square rounded-xl overflow-hidden mb-2">
                        <img src={rp.image} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                      </div>
                      <h4 className="text-[11px] font-bold truncate mb-1 group-hover/item:text-cyan-400 transition-colors">{rp.name}</h4>
                      <p className="text-[10px] font-black text-slate-400">${rp.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mb-6">
              <Package className="w-3.5 h-3.5 text-slate-500" />
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