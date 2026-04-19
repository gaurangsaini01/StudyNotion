import signupImage from "../assets/Images/signup.webp";
import Template from "../components/Auth/Template";

function Signup() {
  return (
    <Template
      title="Join the millions learning to code with CourseNova AI for Free"
      desc1="Build skills for today, tomorrow and beyond !"
      desc2="Education to future proof your career !"
      image={signupImage}
      formType="signup"
    />
  );
}

export default Signup;
