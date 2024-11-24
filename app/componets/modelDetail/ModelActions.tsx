import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash } from 'lucide-react'

export default function ModelActions({
  model,
  hasPurchased,
  onBuy,
  onDownload,
  isCurrentUserSeller,
  onUpdateModel,
  onDeleteModel,
}) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Pricing</h2>
          {model.is_free ? (
            <Badge className="text-lg">Free</Badge>
          ) : (
            <p className="text-2xl font-bold text-gray-800">${model.price}</p>
          )}
        </div>
        <div>
          {model.is_free || hasPurchased ? (
            <Button onClick={onDownload}>Download</Button>
          ) : (
            <Button onClick={onBuy}>Buy Now</Button>
          )}
        </div>
      </div>
      {isCurrentUserSeller && (
        <div className="flex space-x-4 mt-4">
          <Button variant="outline" onClick={onUpdateModel} className="flex items-center">
            <Edit className="w-5 h-5 mr-2" />
            Update Model
          </Button>
          <Button variant="destructive" onClick={onDeleteModel} className="flex items-center">
            <Trash className="w-5 h-5 mr-2" />
            Delete Model
          </Button>
        </div>
      )}
    </Card>
  )
}

