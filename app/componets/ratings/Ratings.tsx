// app/components/ratings/Ratings.tsx

import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";

interface RatingComponentProps {
  rating: number;
  onRatingChange?: (newRating: number) => void;
  isEditable?: boolean;
}

const RatingComponent: React.FC<RatingComponentProps> = ({
  rating,
  onRatingChange,
  isEditable = false,
}) => {
  const [currentRating, setCurrentRating] = useState<number>(rating);

  useEffect(() => {
    setCurrentRating(rating);
  }, [rating]);

  const handleStarClick = (starValue: number) => {
    if (isEditable) {
      setCurrentRating(starValue);
      if (onRatingChange) {
        onRatingChange(starValue);
      }
    }
  };

 const renderStars = () => {
   const stars = [];
   const totalStars = 5;

   for (let i = 1; i <= totalStars; i++) {
     const isFilled = i <= currentRating;
     const starClass = isFilled ? "text-yellow-400 fill-yellow-400" : "text-gray-300";

     stars.push(
       <Star
         key={i}
         className={`${starClass} ${isEditable ? "cursor-pointer" : ""}`}
         size={24}
         onMouseEnter={isEditable ? () => handleStarClick(i) : undefined}
       />
     );
   }

   return stars;
 };


  return (
    <div className="flex items-center space-x-1">
      {renderStars()}
      {/* Optionally display the numeric rating */}
      {!isEditable && (
        <span className="ml-2 text-sm text-gray-500">{rating.toFixed(0)}</span>
      )}
    </div>
  );
};

export default RatingComponent;
