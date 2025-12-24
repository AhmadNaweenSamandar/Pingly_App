import { useState } from "react";
import { motion } from "motion/react";
import { GraduationCap, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";


//this part differentiate among login and sign up page
interface LoginSignupProps {
  onLogin: () => void;
  onSignup: () => void;
}


/**
    * LoginSignup Component
    * * The entry barrier for the application.
    * * Handles authentication state and enforces university email domain restrictions.
    */
export function LoginSignup({ onLogin, onSignup }: LoginSignupProps) {
  
  // =========================================
  // State Definitions
  // =========================================

  // Toggles between "Sign In" (true) and "Create Account" (false) views
  const [isLogin, setIsLogin] = useState(true);

  // Form Input States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Validation Feedback State
  // Used to display issues like "Invalid domain" or "Wrong password"
  const [error, setError] = useState("");


  // =========================================
  // Constants
  // =========================================
  
  // The specific email domain required to access the platform.
  // This ensures the app remains exclusive to University of Ottawa community.
  const ALLOWED_DOMAIN = "@uottawa.ca";


  /**
   * Validates if the email belongs to the allowed uOttawa domain.
   * @param {string} email - The input email address.
   * @returns {boolean} - True if email ends with @university.edu
   */
  const validateEmail = (email: string) => {
    // strict check for the domain suffix
    return email.endsWith(ALLOWED_DOMAIN);
  };



  /**
   * Main Form Submission Handler
   * Orchestrates validation and authentication callbacks.
   */
  const handleSubmit = (e: React.FormEvent) => {

    // Prevent default HTML form submission (page reload)
    e.preventDefault();

    // Clear any previous error messages
    setError("");


    // 1. Domain Validation
    // Enforce the uOttawa email restriction
    if (!validateEmail(email)) {
      setError(`Please use your school email (${ALLOWED_DOMAIN})`);
      return; // Stop execution
    }

    // 2. Password Strength Validation
    // Basic length check for security
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return; // Stop execution
    }

    if (isLogin) {
      // Mock login - in real app, validate credentials
      // Scenario: User is logging in
      // In a real app, I would await an API call here
      onLogin();
    } else {
      // Navigate to registration form
      // Scenario: User is creating an account
      // Redirect to the multi-step registration flow
      onSignup();
    }
  };

  return (

    // === PAGE CONTAINER ===
    // - min-h-screen: Ensures background covers the whole view even on mobile.
    // - bg-gradient...: Blends Blue (Work) and Pink (Social) to represent the whole app.
    // - flex...: Perfectly centers the card horizontally and vertically.
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      {/* === CARD ANIMATION WRAPPER === 
          - Slides up and fades in on page load.
      */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >

        {/* === MAIN CARD === 
            - rounded-3xl: Extra rounded corners for a modern, friendly look.
            - shadow-2xl: Deep shadow makes it 'pop' off the background.
        */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          
          {/* === HEADER SECTION === */}
          <div className="text-center mb-8">

            {/* Logo Icon 
                - Interactive: Scales and rotates slightly on hover.
            */}
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 mb-4"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <GraduationCap className="w-8 h-8 text-white" />
            </motion.div>

            {/* App Title 
                - bg-clip-text: Makes the text itself a gradient color.
            */}
            <h1 className="mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Welcome to Pingly
            </h1>

            {/* Dynamic Subtitle 
                - Changes based on whether user is Logging In or Signing Up.
            */}
            <p className="text-gray-600">
              {isLogin ? "Sign in to continue" : "Create your student account"}
            </p>
          </div>

          {/* Toggle Buttons */}

          {/* === VIEW SWITCHER (Segmented Control) === 
              - A pill-shaped toggle to switch between Login and Signup.
              - bg-gray-100: Creates the "track" background.
              - p-1: Padding ensures the white buttons don't touch the edge of the gray track.
          */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">

            {/* BUTTON 1: LOGIN */}
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-lg transition-all ${

                // Conditional Styling:
                isLogin
                  ? "bg-white shadow-md text-blue-600"  // Active: White card, Blue text
                  : "text-gray-600"                     // Inactive: Gray text, slight hover effect
              }`}
            >
              Login
            </button>

            {/* BUTTON 2: SIGN UP */}
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-lg transition-all ${

                // Conditional Styling:
                !isLogin
                  ? "bg-white shadow-md text-purple-600"      // Active: White card, Purple text
                  : "text-gray-600"                           // Inactive
              }`}
            >
              Sign Up
            </button>
          </div>


          {/* Form */}
          {/* === MAIN FORM === 
              - space-y-4: Adds vertical spacing between inputs.
          */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* --- INPUT GROUP: EMAIL --- */}
            <div>
              <label className="block mb-2 text-gray-700">School Email</label>
              <div className="relative">

                {/* Icon: Absolute positioned inside the input */}
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"

                  // Dynamic placeholder suggests the required domain
                  placeholder={`your-email${ALLOWED_DOMAIN}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  // pl-10: Padding Left ensures text doesn't overlap the icon
                  className="pl-10"
                  required
                />
              </div>
            </div>


            {/* --- INPUT GROUP: PASSWORD --- */}
            <div>
              <label className="block mb-2 text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>


            {/* --- ERROR FEEDBACK --- 
                - Only renders if 'error' state is not empty.
                - Animates in for better visibility.
            */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600"
              >
                {error}
              </motion.div>
            )}


            {/* --- LOGIN SPECIFIC OPTIONS --- 
                - "Remember Me" & "Forgot Password" only relevant for existing users.
            */}
            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" className="rounded" />
                  Remember me
                </label>
                <a href="#" className="text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
            )}


            {/* --- SUBMIT ACTION --- 
                - Gradient background to stand out.
                - Dynamic text based on mode.
            */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
            >
              {isLogin ? "Sign In" : "Create Account"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>


          {/* --- FOOTER: LEGAL --- */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
