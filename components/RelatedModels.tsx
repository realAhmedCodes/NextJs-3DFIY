import { Card } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'

export default function RelatedModels({ relatedModels }) {
  return (
    <Card className="p-6 mt-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Related Models</h2>
      <div className="space-y-4">
        {relatedModels && relatedModels.length > 0 ? (
          relatedModels.map((relatedModel) => (
            <Link href={`/models/${relatedModel.model_id}`} key={relatedModel.model_id}>
              <div className="flex items-center space-x-4 hover:bg-gray-100 p-2 rounded-lg transition duration-200">
                <div className="relative w-16 h-16">
                  <Image
                    src={relatedModel.image_url}
                    alt={relatedModel.model_name}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-700">{relatedModel.model_name}</p>
                  <p className="text-sm text-gray-500">
                    {relatedModel.is_free ? 'Free' : `$${relatedModel.price}`}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-600">No related models found.</p>
        )}
      </div>
    </Card>
  )
}

