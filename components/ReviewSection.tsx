import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { StarIcon } from 'lucide-react'

export default function ReviewSection({ modelId }) {
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')

  const handleSubmitReview
= () => {
    console.log('Submitting review:', { modelId, rating, review })
  }

  return (
    <Card className="p-6 mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reviews</h2>
      <div className="flex mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`w-6 h-6 cursor-pointer ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
      <Textarea
        placeholder="Write your review..."
        className="mb-4"
        value={review}
        disabled
        onChange={(e) => setReview(e.target.value)}
      />
      <Button disabled onClick={handleSubmitReview}>Submit Review</Button>
    </Card>
  )
}

