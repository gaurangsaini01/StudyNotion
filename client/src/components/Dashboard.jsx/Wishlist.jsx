import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";
import { TiHeartFullOutline } from "react-icons/ti";
import { RiDeleteBin6Line } from "react-icons/ri";
import { removeFromCart } from "../../redux/slices/cartSlice";
import IconBtn from "../reusable/IconBtn";

function Wishlist() {
  const { totalPrice, totalItems, cart } = useSelector((state) => state.cart);
  console.log(removeFromCart);
  const dispatch = useDispatch();
  function handleBuyCourse(){
    console.log('khareed liye');
  }
  return (
    <div className="p-6 text-richblack-5">
      <h1>Your Cart</h1>
      <p className="text-richblack-300 text-sm">{totalItems} Courses in Cart</p>
      {totalItems > 0 ? (
        <>
          <div>
            {cart.map((course, index) => (
              <div key={index}>
                <img src={course.thumbnail} alt="Img" />
                <div>
                  <p>{course.courseName}</p>
                  <p>{course.category.name}</p>
                  <div>
                    <span>4.8</span>
                    <ReactStars
                      count={5}
                      // onChange={() => {}}
                      edit={false}
                      value={4.8}
                      size={20}
                      // fullIcon={<FaRegFaceGrinHearts />}
                      emptyIcon={<TiHeartFullOutline />}
                      filledIcon={<TiHeartFullOutline />}
                      activeColor="#ff0000"
                    />
                  </div>
                </div>
                <div>
                  <button onClick={() => dispatch(removeFromCart(course._id))}>
                    <RiDeleteBin6Line />
                    <span>Remove</span>
                  </button>
                  <p>Rs {course.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div>
            <p>Total:</p>
            <p>Rs.{totalPrice}</p>
            <IconBtn text={"Buy Now"} onClick={handleBuyCourse} customClasses={"w-full justify-center"}/>
          </div>
        </>
      ) : (
        <p>No Courses In Cart</p>
      )}
    </div>
  );
}

export default Wishlist;
