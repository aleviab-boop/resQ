'use client'
import { useState } from 'react'

const ASPECTS = ['Punctuality', 'Work quality', 'Behaviour', 'Cleanliness']

export default function RatingModal({ booking, onClose, onSubmit }) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [aspects, setAspects] = useState({})
  const [review, setReview] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function toggleAspect(a) {
    setAspects(prev => ({ ...prev, [a]: !prev[a] }))
  }

  function handleSubmit() {
    if (rating === 0) return
    setSubmitted(true)
    onSubmit?.({ rating, aspects, review })
  }

  if (submitted) return (
    <div className="fixed inset-0 z-[500] bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center" onClick={e => e.stopPropagation()}>
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-xl font-extrabold text-gray-900 mb-2">Thanks for rating!</h3>
        <p className="text-gray-500 text-sm mb-6">Your feedback helps other customers and motivates our technicians.</p>
        <button onClick={onClose} className="w-full py-3.5 bg-sky text-white font-bold rounded-2xl hover:bg-sky/90 transition">Done</button>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-[500] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-extrabold text-lg text-gray-900">Rate your experience</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl">×</button>
        </div>

        {/* Technician */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4 mb-5">
          <div className="w-11 h-11 rounded-full bg-navy text-white flex items-center justify-center font-bold text-base">
            {(booking?.tech?.name || 'T').charAt(0)}
          </div>
          <div>
            <div className="font-bold text-gray-900 text-sm">{booking?.tech?.name || 'Technician'}</div>
            <div className="text-xs text-gray-400">{booking?.service || 'Service'}</div>
          </div>
        </div>

        {/* Star rating */}
        <div className="text-center mb-5">
          <div className="text-sm font-bold text-gray-700 mb-3">How would you rate the service?</div>
          <div className="flex justify-center gap-3">
            {[1,2,3,4,5].map(i => (
              <button key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)} onClick={() => setRating(i)}
                className="transition-transform hover:scale-125">
                <svg className={`w-10 h-10 ${i <= (hover || rating) ? 'text-yellow-400' : 'text-gray-200'} transition-colors`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </button>
            ))}
          </div>
          {rating > 0 && (
            <div className="text-sm font-semibold mt-2 text-gray-600">
              {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'][rating]}
            </div>
          )}
        </div>

        {/* Aspects */}
        {rating >= 4 && (
          <div className="mb-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">What did you like?</div>
            <div className="flex flex-wrap gap-2">
              {ASPECTS.map(a => (
                <button key={a} onClick={() => toggleAspect(a)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition ${aspects[a] ? 'bg-sky border-sky text-white' : 'border-gray-200 text-gray-600 hover:border-sky/50'}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Written review */}
        <div className="mb-5">
          <textarea value={review} onChange={e => setReview(e.target.value)} rows={3}
            placeholder="Share more about your experience (optional)..."
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-sky resize-none" />
        </div>

        <button disabled={rating === 0} onClick={handleSubmit}
          className={`w-full py-4 rounded-2xl font-bold text-white transition ${rating > 0 ? 'bg-sky hover:bg-sky/90' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
          Submit Rating
        </button>
      </div>
    </div>
  )
}
