
import React, { useState, useEffect, useMemo } from 'react';
import { PRODUCTS } from './constants';
import { View, Product, CartItem, Order } from './types';
import { getAIRecommendation } from './geminiService';
import { 
  Search, Send, ShoppingCart, Plus, Minus, Trash2, QrCode, 
  ArrowRight, Sparkles, Clock, CheckCircle, Smartphone, 
  History, Info, ShoppingBag, X, Zap 
} from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info';
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Track quantities for items not yet in cart (local to catalog view)
  const [catalogQuantities, setCatalogQuantities] = useState<Record<string, number>>({});

  const addToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    
    addToast(`Đã thêm ${quantity}x ${product.name} vào giỏ!`);
    // Reset catalog quantity after adding
    setCatalogQuantities(prev => ({ ...prev, [product.id]: 1 }));
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find(i => i.id === productId);
    setCart(prev => prev.filter(item => item.id !== productId));
    if (item) addToast(`Đã xóa ${item.name}`, 'info');
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const totalPrice = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const checkout = () => {
    if (cart.length === 0) return;
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 8).toUpperCase(),
      items: [...cart],
      totalPrice,
      timestamp: Date.now(),
      qrCodeValue: `TSC-${Math.random().toString(36).substr(2, 6).toUpperCase()}-${Date.now()}`,
      status: 'pending'
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setCurrentView(View.ORDER_HISTORY);
    addToast('Đặt hàng thành công! Mã QR đã sẵn sàng.', 'success');
  };

  const completeOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'collected' } : o));
    addToast('Nhận hàng thành công. Chúc bạn vui vẻ!', 'success');
  };

  const handleAiAsk = async () => {
    if (!aiInput.trim()) return;
    setIsAiLoading(true);
    const response = await getAIRecommendation(aiInput);
    setAiResponse(response);
    setIsAiLoading(false);
  };

  const filteredProducts = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateCatalogQty = (id: string, delta: number) => {
    setCatalogQuantities(prev => {
      const current = prev[id] || 1;
      return { ...prev, [id]: Math.max(1, current + delta) };
    });
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView} cartCount={cart.reduce((a, b) => a + b.quantity, 0)}>
      {/* Toast Notifications */}
      <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 animate-in slide-in-from-right-10 duration-300 pointer-events-auto ${
              toast.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-slate-900 border-slate-800 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
            <span className="text-sm font-semibold">{toast.message}</span>
            <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="ml-2 opacity-50 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {currentView === View.HOME && (
        <div className="space-y-16 animate-in fade-in duration-700">
          <section className="relative h-[600px] rounded-[3rem] overflow-hidden bg-slate-900 group">
            <img 
              src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1200&auto=format&fit=crop" 
              alt="Hero" 
              className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 backdrop-blur-md border border-indigo-400/30 rounded-full text-indigo-300 text-sm font-bold mb-6 animate-bounce">
                <Zap className="w-4 h-4 fill-current" /> Dịch vụ bí mật & siêu tốc
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
                An toàn tuyệt đối <br/> <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">The Shield Point</span>
              </h2>
              <p className="text-slate-300 max-w-xl mb-10 text-lg md:text-xl font-medium">
                Đặt hàng qua app - Quét mã tại máy. Giải pháp nhận hàng riêng tư nhất cho cuộc sống hiện đại.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <button 
                  onClick={() => setCurrentView(View.CATALOG)}
                  className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all hover:scale-105 shadow-xl shadow-indigo-500/30 flex items-center gap-2"
                >
                  Mua hàng ngay <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </section>

          <section id="ai-consultant" className="bg-gradient-to-br from-indigo-900 to-violet-950 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
             <div className="relative z-10 grid lg:grid-cols-5 gap-12 items-center">
                <div className="lg:col-span-2 space-y-6">
                   <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/30 border border-indigo-400/30 rounded-full text-indigo-100 text-xs font-black uppercase tracking-widest">
                      <Sparkles className="w-4 h-4 text-amber-400" /> AI Support
                   </div>
                   <h2 className="text-4xl md:text-5xl font-black leading-tight">Tư vấn <br/> Sản phẩm phù hợp</h2>
                   <p className="text-indigo-200 text-lg">
                     Hãy nói về nhu cầu hoặc phong cách của bạn, chúng tôi sẽ đề xuất lựa chọn hoàn hảo.
                   </p>
                </div>
                <div className="lg:col-span-3 space-y-4">
                   <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 min-h-[300px] flex flex-col">
                      <div className="flex-1 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                         {aiResponse ? (
                           <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                             <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center shrink-0">
                                   <Sparkles className="w-5 h-5" />
                                </div>
                                <div className="bg-indigo-800/50 p-5 rounded-2xl rounded-tl-none border border-indigo-700/50 leading-relaxed italic text-indigo-50">
                                   {aiResponse}
                                </div>
                             </div>
                           </div>
                         ) : (
                           <div className="h-full flex flex-col items-center justify-center text-indigo-300/50 space-y-4 text-center">
                              <p className="font-medium">Nhập câu hỏi để bắt đầu...</p>
                           </div>
                         )}
                      </div>
                      <div className="flex gap-3 bg-white/10 p-2 rounded-2xl border border-white/10">
                        <input 
                          type="text" 
                          value={aiInput}
                          onChange={(e) => setAiInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAiAsk()}
                          placeholder="Hỏi AI bất cứ điều gì..."
                          className="flex-1 bg-transparent border-none px-4 py-3 text-white focus:outline-none placeholder:text-indigo-300/50"
                        />
                        <button 
                          onClick={handleAiAsk}
                          disabled={isAiLoading}
                          className="px-6 py-3 bg-white text-indigo-900 rounded-xl font-bold hover:bg-indigo-50 transition-all disabled:opacity-50"
                        >
                          {isAiLoading ? '...' : 'Gửi'}
                        </button>
                      </div>
                   </div>
                </div>
             </div>
          </section>
        </div>
      )}

      {currentView === View.CATALOG && (
        <div className="animate-in fade-in slide-in-from-bottom-6 space-y-12">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Cửa hàng Trực tuyến</h2>
                <p className="text-slate-500 font-medium">Bảo mật - Nhanh chóng - Tiện lợi</p>
              </div>
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên..."
                  className="pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl w-full md:w-[400px] focus:outline-none shadow-sm"
                />
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
             {filteredProducts.map(product => {
               const qty = catalogQuantities[product.id] || 1;
               return (
                <div key={product.id} className="group flex flex-col bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.1)] transition-all duration-500 overflow-hidden relative">
                   <div className="relative h-80 overflow-hidden">
                     <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                   </div>

                   <div className="p-8 space-y-6">
                      <div className="space-y-2">
                         <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">{product.brand}</p>
                         <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">{product.name}</h3>
                         <p className="text-slate-400 text-sm leading-relaxed">{product.description}</p>
                      </div>
                      
                      <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                         <div className="flex flex-col">
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">GIÁ BÁN</p>
                            <p className="text-3xl font-black text-slate-900">{product.price.toLocaleString()}đ</p>
                         </div>
                         
                         <div className="flex flex-col items-end gap-3">
                            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-100 shadow-sm">
                               <button 
                                 onClick={() => updateCatalogQty(product.id, -1)}
                                 className="w-10 h-10 flex items-center justify-center bg-white rounded-xl hover:bg-slate-100 transition-colors shadow-sm text-indigo-600"
                               >
                                 <Minus className="w-4 h-4" />
                               </button>
                               <span className="w-8 text-center font-black text-lg text-slate-900">{qty}</span>
                               <button 
                                 onClick={() => updateCatalogQty(product.id, 1)}
                                 className="w-10 h-10 flex items-center justify-center bg-white rounded-xl hover:bg-slate-100 transition-colors shadow-sm text-indigo-600"
                               >
                                 <Plus className="w-4 h-4" />
                               </button>
                            </div>
                            <button 
                              onClick={() => addToCart(product, qty)}
                              className="w-full py-3 px-6 bg-indigo-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-100"
                            >
                              <Plus className="w-5 h-5" /> THÊM
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
               );
             })}
           </div>
        </div>
      )}

      {currentView === View.CART && (
        <div className="animate-in fade-in slide-in-from-right-6 max-w-5xl mx-auto space-y-10">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                 <ShoppingBag className="w-6 h-6" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Giỏ hàng của bạn</h2>
           </div>
           
           {cart.length > 0 ? (
             <div className="grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-4">
                   {cart.map(item => (
                     <div key={item.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 flex flex-wrap sm:flex-nowrap gap-6 items-center shadow-sm">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                           <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <h4 className="font-bold text-lg text-slate-900 truncate">{item.name}</h4>
                           <p className="text-indigo-600 font-black mt-1 text-lg">{item.price.toLocaleString()}đ</p>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                           <button onClick={() => updateQuantity(item.id, -1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-500">
                              <Minus className="w-4 h-4" />
                           </button>
                           <span className="text-lg font-black w-6 text-center text-slate-900">{item.quantity}</span>
                           <button onClick={() => updateQuantity(item.id, 1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-500">
                              <Plus className="w-4 h-4" />
                           </button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-red-500 transition-all">
                           <Trash2 className="w-6 h-6" />
                        </button>
                     </div>
                   ))}
                </div>

                <div className="space-y-6">
                   <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] space-y-8 shadow-2xl relative overflow-hidden">
                      <h3 className="text-2xl font-black">Hóa đơn</h3>
                      <div className="space-y-4">
                         <div className="flex justify-between text-slate-400 font-medium">
                            <span>Tạm tính ({cart.reduce((a,b)=>a+b.quantity, 0)} sản phẩm)</span>
                            <span>{totalPrice.toLocaleString()}đ</span>
                         </div>
                         <div className="h-px bg-slate-800 my-4"></div>
                         <div className="flex justify-between items-end">
                            <span className="text-lg font-bold text-indigo-400">Tổng</span>
                            <span className="text-4xl font-black">{totalPrice.toLocaleString()}đ</span>
                         </div>
                      </div>
                      <button 
                        onClick={checkout}
                        className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
                      >
                        Tiến hành đặt hàng <ArrowRight className="w-6 h-6" />
                      </button>
                   </div>
                </div>
             </div>
           ) : (
             <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                <h3 className="text-3xl font-black text-slate-900">Giỏ hàng đang trống</h3>
             </div>
           )}
        </div>
      )}

      {currentView === View.ORDER_HISTORY && (
        <div className="animate-in fade-in slide-in-from-left-6 max-w-4xl mx-auto space-y-10">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                 <History className="w-6 h-6" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Lịch sử giao dịch</h2>
           </div>
           
           {orders.length > 0 ? (
             <div className="space-y-8">
                {orders.map(order => (
                  <div key={order.id} className={`group bg-white rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden ${order.status === 'collected' ? 'grayscale opacity-60 border-slate-100' : 'border-indigo-50 shadow-xl'}`}>
                     <div className="p-8 md:p-10 flex flex-col md:flex-row gap-12 items-center">
                        <div className="shrink-0 flex flex-col items-center gap-4">
                           <div className={`p-4 rounded-[2rem] border-4 flex flex-col items-center justify-center relative overflow-hidden bg-white ${order.status === 'collected' ? 'border-slate-100' : 'border-indigo-600'}`}>
                              <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(order.qrCodeValue)}&color=4f46e5`}
                                alt="Mã đơn hàng"
                                className={`w-52 h-52 object-contain ${order.status === 'collected' ? 'opacity-20' : ''}`}
                              />
                              {order.status === 'collected' && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                                     <CheckCircle className="w-8 h-8 text-white" />
                                  </div>
                                </div>
                              )}
                           </div>
                           <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full font-mono text-xs tracking-widest font-bold uppercase">
                             MÃ: {order.id}
                           </span>
                        </div>
                        
                        <div className="flex-1 w-full space-y-8">
                           <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                 <h4 className="font-black text-3xl text-slate-900 tracking-tight">Chi tiết đơn hàng</h4>
                                 <div className="flex flex-col items-end gap-1">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                      order.status === 'pending' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                                    }`}>
                                      {order.status === 'pending' ? 'Chưa nhận hàng' : 'Đã hoàn tất'}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                                      <Clock className="w-3.5 h-3.5" /> {new Date(order.timestamp).toLocaleTimeString('vi-VN')} {new Date(order.timestamp).toLocaleDateString('vi-VN')}
                                    </div>
                                 </div>
                              </div>

                              <div className="bg-slate-50/50 rounded-3xl p-6 space-y-4 border border-slate-100">
                                 {order.items.map(item => (
                                   <div key={item.id} className="flex justify-between items-center">
                                     <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-sm font-black text-indigo-600 shadow-sm">
                                           {item.quantity}
                                        </div>
                                        <span className="text-slate-800 font-bold text-lg">{item.name}</span>
                                     </div>
                                     <span className="font-black text-slate-900 text-lg">{(item.price * item.quantity).toLocaleString()}đ</span>
                                   </div>
                                 ))}
                              </div>
                           </div>

                           <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-6 pt-4">
                              <div>
                                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">TỔNG THANH TOÁN</p>
                                 <p className="text-4xl font-black text-indigo-600 leading-none">{order.totalPrice.toLocaleString()}đ</p>
                              </div>
                              {order.status === 'pending' && (
                                <button 
                                  onClick={() => setCurrentView(View.MACHINE_SIMULATOR)}
                                  className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
                                >
                                  Mở máy nhận hàng <ArrowRight className="w-5 h-5" />
                                </button>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                <History className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-3xl font-black text-slate-900 mb-2">Chưa có lịch sử giao dịch</h3>
             </div>
           )}
        </div>
      )}

      {currentView === View.MACHINE_SIMULATOR && (
        <div className="animate-in zoom-in-95 duration-500 space-y-8">
          <div className="max-w-2xl mx-auto text-center space-y-4">
             <h2 className="text-4xl font-black text-slate-900 uppercase">THE SHIELD POINT</h2>
             <p className="text-slate-500 font-medium tracking-wide">Hệ thống nhận hàng tự động an toàn & riêng tư.</p>
          </div>
          <MachineSimulator 
            orders={orders} 
            onCompleteOrder={completeOrder}
          />
        </div>
      )}
    </Layout>
  );
};

export default App;
