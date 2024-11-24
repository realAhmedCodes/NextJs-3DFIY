import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Heart, HeartIcon as HeartFilled, Bookmark, Info } from 'lucide-react'
import Image from 'next/image'

export default function ModelHeader({ model, isLiked, isSaved, onLike, onSave }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Avatar className="w-12 h-12">
          {model.user && model.user.profile_pic ? (
            <Image
              src={model.user.profile_pic}
              alt={model.user.name}
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <Info className="w-6 h-6 text-gray-500" />
          )}
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{model.model_name}</h1>
          {model.user && (
            <p className="text-sm text-gray-500">
              by {model.user.name} • {model.user.location}
            </p>
          )}
        </div>
      </div>
      <div className="flex space-x-2">
        <Button variant="ghost" onClick={onLike} aria-label={isLiked ? 'Unlike' : 'Like'}>
          {isLiked ? (
            <HeartFilled className="text-red-500 w-6 h-6" />
          ) : (
            <Heart className="w-6 h-6" />
          )}
        </Button>
        <Button variant="ghost" onClick={onSave} aria-label={isSaved ? 'Unsave' : 'Save'}>
          <Bookmark className={`w-6 h-6 ${isSaved ? 'text-primary fill-primary' : ''}`} />
        </Button>
      </div>
    </div>
  )
}

