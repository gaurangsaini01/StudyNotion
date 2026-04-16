import type { RatingAndReview } from "../types/domain";

export default function getAvgRating(
  ratingArr: RatingAndReview[] = []
): number {
  if (ratingArr.length === 0) return 0;

  //using reduce to calculate the sum of rating
  const totalReviewCount = ratingArr.reduce((acc, curr) => {
    acc += curr.rating;
    return acc;
  }, 0);

  const avgReviewCount = Math.round(totalReviewCount / ratingArr.length);

  return avgReviewCount;
}
