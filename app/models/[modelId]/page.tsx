'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import ModelHeader from './components/ModelHeader'
import ModelDetails from './components/ModelDetails'
import ModelActions from './components/ModelActions'
import ModelGallery from './components/ModelGallery'
import RelatedModels from './components/RelatedModels'
import ReviewSection from './components/ReviewSection'
import PaymentModal from '@/components/PaymentModal'

const stripePromiseClient = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

// Dummy data
const dummyModel = {
  model_id: '123',
  model_name: 'Futuristic City Model',
  description: 'A detailed 3D model of a futuristic cityscape, perfect for sci-fi projects and urban planning visualizations.',
  image_url: '/placeholder.svg?height=400&width=600',
  images: [
    { url: '/placeholder.svg?height=400&width=600' },
    { url: '/placeholder.svg?height=400&width=600' },
    { url: '/placeholder.svg?height=400&width=600' },
  ],
  price: 49.99,
  is_free: false,
  specifications: 'Poly count: 1M, Textures: 4K, File formats: FBX, OBJ, GLTF',
  formats: 'FBX, OBJ, GLTF',
  tags: ['Futuristic', 'City', 'Sci-Fi', 'Urban', '3D'],
  user: {
    name: 'Jane Doe',
    profile_pic: '/placeholder.svg?height=100&width=100',
    location: 'New York, USA'
  },
  designer_id: '456',
  type: 'designer',
  relatedModels: [
    { model_id: '789', model_name: 'Cyberpunk Vehicle', image_url: '/placeholder.svg?height=200&width=200', price: 29.99, is_free: false },
    { model_id: '101', model_name: 'Neon Sign Pack', image_url: '/placeholder.svg?height=200&width=200', price: 19.99, is_free: false },
    { model_id: '102', model_name: 'Holographic Interface', image_url: '/placeholder.svg?height=200&width=200', price: 0, is_free: true },
  ]
}

export default function ModelPage({ params }: { params: { modelId: string } }) {
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [hasPurchased, setHasPurchased] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleLike = () => setIsLiked(!isLiked)
  const handleSave = () => setIsSaved(!isSaved)
  const handlePurchaseSuccess = () => {
    setHasPurchased(true)
    setIsModalOpen(false)
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <ModelHeader
          model={dummyModel}
          isLiked={isLiked}
          isSaved={isSaved}
          onLike={handleLike}
          onSave={handleSave}
        />
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <div className="lg:w-2/3">
            <ModelGallery images={dummyModel.images} mainImage={dummyModel.image_url} />
            <ModelDetails model={dummyModel} />
          </div>
          <div className="lg:w-1/3">
            <ModelActions
              model={dummyModel}
              hasPurchased={hasPurchased}
              onBuy={() => setIsModalOpen(true)}
              onDownload={() => console.log('Download clicked')}
              isCurrentUserSeller={false}
              onUpdateModel={() => router.push(`/models/${params.modelId}/updateModel`)}
              onDeleteModel={() => console.log('Delete clicked')}
            />
            <RelatedModels relatedModels={dummyModel.relatedModels} />
          </div>
        </div>
        <ReviewSection modelId={dummyModel.model_id} />
      </div>
      {isModalOpen && (
        <Elements stripe={stripePromiseClient}>
          <PaymentModal
            model={dummyModel}
            userId="dummy-user-id"
            authToken="dummy-auth-token"
            onClose={() => setIsModalOpen(false)}
            onSuccess={handlePurchaseSuccess}
          />
        </Elements>
      )}
    </div>
  )
}

