import React, { useState } from 'react';
import { 
  Star, 
  Upload, 
  CheckCircle2, 
  ExternalLink, 
  X, 
  Heart, 
  Gift, 
  MessageSquare, 
  User, 
  Calendar,
  Image as ImageIcon,
  ArrowRight
} from 'lucide-react';

export default function Flow4Feedback({
  feedbackList,
  onAddFeedback,
  onSwitchToAdmin,
  onSwitchToCustomer,
  viewMode = 'invitation', // 'invitation' | 'form' | 'submitted' | 'admin-list'
  setViewMode,
  onViewOrderDetails
}) {
  // Customer Review Form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('She loved it. It was amazing and everything she wanted.');
  const [uploadedPhotos, setUploadedPhotos] = useState([
    'https://images.unsplash.com/photo-1513885535751-8b9238bd48?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80'
  ]);

  // Selected feedback for admin modal view
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Handle adding photo simulator
  const handleAddSamplePhoto = () => {
    const samplePool = [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'
    ];
    const nextPhoto = samplePool[uploadedPhotos.length % samplePool.length];
    setUploadedPhotos([...uploadedPhotos, nextPhoto]);
  };

  const handleRemovePhoto = (index) => {
    setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== index));
  };

  // Submit review form
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewText) return;

    const newFb = {
      id: `FB-${Date.now()}`,
      customer: 'Eyimofe',
      orderId: '#483925',
      rating,
      review: reviewText,
      date: 'Sep 1, 2026',
      photos: uploadedPhotos,
      orderInfo: {
        recipient: 'Mum',
        occasion: 'Birthday',
        products: ['Luxury Self-Care Box', 'Scented Soy Candle', 'Personalized Card'],
        packaging: 'Premium Gift Basket',
        delivery: 'Doorstep Surprise',
        location: 'Gbagada, Lagos',
      }
    };

    onAddFeedback(newFb);
    setViewMode('submitted');
  };

  // Render Star Rating component
  const renderStars = (starCount, interactive = false) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`w-4 h-4 ${interactive ? 'cursor-pointer transition transform hover:scale-110' : ''} ${
              star <= (hoverRating || starCount)
                ? 'text-amber-400 fill-amber-400'
                : 'text-slate-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // CUSTOMER REVIEW INVITATION SCREEN (6A)
  if (viewMode === 'invitation') {
    return (
      <div className="max-w-md mx-auto py-12 px-4 font-sans text-slate-900">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs text-center space-y-6">
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto text-orange-500 border border-orange-200/60">
            <Gift className="w-6 h-6 text-orange-500" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              How did it go? 🎁
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              We'd love to know how they liked their gift.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 text-left space-y-1.5 text-xs">
            <div className="flex justify-between font-bold text-slate-900">
              <span>Order #483925</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-emerald-200/70">Delivered</span>
            </div>
            <div className="text-slate-600">Gift sent to: <span className="font-semibold text-slate-800">Mum</span></div>
            <div className="text-slate-400">Delivered: September 1, 2026</div>
          </div>

          <button
            onClick={() => setViewMode('form')}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl shadow-xs transition text-xs flex items-center justify-center space-x-2"
          >
            <span>Leave a Review</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // CUSTOMER REVIEW FORM (6B)
  if (viewMode === 'form') {
    return (
      <div className="max-w-md mx-auto py-10 px-4 font-sans text-slate-900">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs space-y-6">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">How did they like it?</h1>
            <p className="text-xs text-slate-500 mt-0.5">Share your experience sending this gift.</p>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Rating</label>
              {renderStars(rating, true)}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tell us about it</label>
              <textarea
                rows={4}
                required
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Tell us how the gift went..."
                className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Add Photos</label>
              <div className="grid grid-cols-4 gap-2.5">
                {uploadedPhotos.map((src, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden border border-slate-200 h-16">
                    <img src={src} alt="Uploaded" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(i)}
                      className="absolute top-1 right-1 bg-slate-900/70 text-white rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddSamplePhoto}
                  className="h-16 rounded-lg border border-dashed border-slate-300 hover:border-orange-500 flex flex-col items-center justify-center text-slate-400 hover:text-orange-500 transition text-[10px] font-semibold bg-slate-50"
                >
                  <Upload className="w-3.5 h-3.5 mb-0.5" />
                  <span>+ Photos</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-xs transition text-xs"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    );
  }

  // CUSTOMER REVIEW SUBMITTED CONFIRMATION (6C)
  if (viewMode === 'submitted') {
    return (
      <div className="max-w-md mx-auto py-12 px-4 font-sans text-slate-900">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs text-center space-y-6">
          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto text-rose-500 border border-rose-200/60">
            <Heart className="w-6 h-6 fill-rose-500" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Thank you ❤️</h1>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              We're glad you helped make someone's day special. Your review has been submitted.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <button
              onClick={() => onSwitchToCustomer('customer')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl shadow-xs transition text-xs"
            >
              Continue Shopping
            </button>

            <button
              onClick={onSwitchToAdmin}
              className="w-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold py-2 rounded-xl transition text-xs"
            >
              Switch to Admin View (See Feedback)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ADMIN FEEDBACK DASHBOARD (6D & 6E)
  return (
    <div className="space-y-6 font-sans text-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Customer Feedback</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            See what customers have to say about the gifts they've sent.
          </p>
        </div>

        <button
          onClick={() => setViewMode('invitation')}
          className="text-xs font-semibold bg-slate-100 hover:bg-slate-200/80 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition"
        >
          Test Customer Review Flow
        </button>
      </div>

      {/* Feedback Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/50 text-[11px] uppercase font-semibold text-slate-400 border-b border-slate-200/80">
            <tr>
              <th className="py-3.5 px-5">Customer</th>
              <th className="py-3.5 px-5">Order</th>
              <th className="py-3.5 px-5">Rating</th>
              <th className="py-3.5 px-5">Review</th>
              <th className="py-3.5 px-5">Date</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {feedbackList.map((fb) => (
              <tr key={fb.id} className="hover:bg-slate-50/60 transition">
                <td className="py-4 px-5 font-bold text-slate-900">{fb.customer}</td>
                <td className="py-4 px-5 font-mono text-orange-600 font-bold">{fb.orderId}</td>
                <td className="py-4 px-5">{renderStars(fb.rating)}</td>
                <td className="py-4 px-5 text-slate-700 max-w-xs truncate">{fb.review}</td>
                <td className="py-4 px-5 text-slate-500">{fb.date}</td>
                <td className="py-4 px-5 text-right">
                  <button
                    onClick={() => setSelectedFeedback(fb)}
                    className="text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100/80 px-2.5 py-1.5 rounded-lg border border-orange-200/70 transition"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADMIN FEEDBACK DETAILS MODAL */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-slate-200/80 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Customer Feedback Details</h3>
                <span className="text-[11px] text-slate-500">{selectedFeedback.date}</span>
              </div>
              <button onClick={() => setSelectedFeedback(null)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="flex items-center justify-between bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/70">
                <div>
                  <span className="text-slate-400 block text-[10px]">Submitted By</span>
                  <span className="font-bold text-slate-900">{selectedFeedback.customer}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] mb-0.5">Rating</span>
                  {renderStars(selectedFeedback.rating)}
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Order Number</span>
                  <button
                    onClick={() => {
                      setSelectedFeedback(null);
                      onViewOrderDetails(selectedFeedback.orderId);
                    }}
                    className="font-mono font-bold text-orange-600 hover:underline flex items-center space-x-1"
                  >
                    <span>{selectedFeedback.orderId}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Review</span>
                <p className="p-3 bg-orange-50/40 rounded-xl border border-orange-200/70 text-slate-800 italic">
                  “{selectedFeedback.review}”
                </p>
              </div>

              {selectedFeedback.photos && selectedFeedback.photos.length > 0 && (
                <div>
                  <span className="font-bold text-slate-700 block mb-1.5">Uploaded Customer Photos</span>
                  <div className="flex flex-wrap gap-2.5">
                    {selectedFeedback.photos.map((photo, i) => (
                      <img
                        key={i}
                        src={photo}
                        alt="Customer upload"
                        className="w-20 h-20 object-cover rounded-lg border border-slate-200 shadow-xs"
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedFeedback.orderInfo && (
                <div className="border-t border-slate-100 pt-3 space-y-1.5">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                    Linked Compact Order Summary
                  </span>
                  <div className="grid grid-cols-2 gap-2.5 bg-slate-50/70 p-3 rounded-xl border border-slate-200/70">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Recipient:</span>
                      <span className="font-semibold text-slate-800">{selectedFeedback.orderInfo.recipient}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Occasion:</span>
                      <span className="font-semibold text-slate-800">{selectedFeedback.orderInfo.occasion}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block text-[10px]">Products:</span>
                      <span className="font-semibold text-slate-800">{selectedFeedback.orderInfo.products.join(', ')}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedFeedback(null);
                    onViewOrderDetails(selectedFeedback.orderId);
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg shadow-xs transition text-xs flex items-center space-x-1.5"
                >
                  <span>View Order</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
