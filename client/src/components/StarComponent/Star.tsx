import Rating from "@mui/material/Rating";
import { styled } from "@mui/material/styles";

const CustomRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#FFD60A",
  },
  "& .MuiRating-iconEmpty": {
    color: "#838894",
  },
});

interface StarRatingProps {
  rating: number;
}

export const StarRating = ({ rating }: StarRatingProps) => {
  return <CustomRating name="read-only" value={rating} readOnly />;
};
