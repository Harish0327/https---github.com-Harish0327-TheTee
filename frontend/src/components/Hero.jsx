import React, { useState } from "react";
import Hero1 from "../assets/Banner.png";
import Hero2 from "../assets/1.webp";
import Hero3 from "../assets/banner3.webp"; // <- New banner image
import { Link } from "react-router-dom";

const Hero = () => {
  const [imageLoaded1, setImageLoaded1] = useState(false);
  const [imageLoaded2, setImageLoaded2] = useState(false);
  const [imageLoaded3, setImageLoaded3] = useState(false);

  return (
    <>
      {/* Banner 1: Combo T-Shirts at ₹999 */}
      <section className="relative overflow-hidden mt-32 rounded-lg z-10 h-[70vh] sm:h-[80vh] md:h-[90vh] bg-white sm:bg-transparent">
        {!imageLoaded1 && <div className="absolute inset-0 bg-gray-200 animate-pulse z-0" />}
        <img
          src={Hero1}
          alt="Combo Offer"
          onLoad={() => setImageLoaded1(true)}
          className={`w-full h-full absolute inset-0 transition-opacity duration-700 ${
            imageLoaded1 ? "opacity-100" : "opacity-0"
          } object-contain sm:object-cover rounded-lg`}
        />
        <div className="hidden sm:block absolute inset-0 bg-black bg-opacity-50 z-10" />

        {/* Small Screen Content */}
        <div className="sm:hidden absolute top-9 left-0 p-3 right-0 z-20 flex justify-center bg-gray-50">
          <div className="text-black text-center max-w-sm">
            <h1 className="text-xl font-bold leading-tight">
              Get 4 Premium T-Shirts <br /> at ₹999 only
            </h1>
            <p className="text-sm mt-1 font-medium">
              Unmatched style & comfort — grab the{" "}
              <span className="font-semibold">Combo Offer</span> now!
            </p>
          </div>
        </div>
        <div className="sm:hidden absolute bottom-28 left-0 right-0 z-20 flex justify-center bg-gray-200 p-3">
          <Link
            to={{ pathname: "/collection", search: "?category=Combo" }}
            className="inline-block bg-black text-white hover:bg-gray-800 transition px-6 py-2 rounded-lg text-sm font-semibold shadow-md"
          >
            Start Buying
          </Link>
        </div>

        {/* Large Screen Content */}
        <div className="hidden sm:flex absolute inset-0 items-center justify-center z-20 px-4">
          <div className="text-white text-center max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              Get 4 Premium T-Shirts <br /> at ₹999 only
            </h1>
            <p className="text-lg md:text-2xl font-semibold mb-6">
              Unique style & comfort — grab the{" "}
              <span className="font-semibold">Combo Offer</span> now!
            </p>
            <Link
              to={{ pathname: "/collection", search: "?category=Combo" }}
              className="inline-block bg-white hover:bg-gray-300 transition text-gray-900 px-6 py-2 rounded-lg text-base md:text-lg font-semibold shadow-md"
            >
              Start Buying
            </Link>
          </div>
        </div>
      </section>

{/* Banner 3: Limited Edition Combo at ₹1099 */}
      <section className="relative overflow-hidden mt-6 sm:mt-8 rounded-lg z-10 h-[65vh] sm:h-[80vh] md:h-[90vh] bg-white sm:bg-transparent">
        {!imageLoaded3 && <div className="absolute inset-0 bg-gray-200 animate-pulse z-0" />}
        <img
          src={Hero3}
          alt="Limited Edition Combo"
          onLoad={() => setImageLoaded3(true)}
          className={`w-full h-full absolute inset-0 transition-opacity duration-700 ${
            imageLoaded3 ? "opacity-100" : "opacity-0"
          } object-contain sm:object-cover rounded-lg`}
        />
        <div className="hidden sm:block absolute inset-0 bg-black bg-opacity-50 z-10" />

        {/* Small Screen Content */}
        <div className="sm:hidden absolute top-9 left-0 p-3 right-0 z-20 flex justify-center bg-gray-50">
          <div className="text-black text-center max-w-sm">
            <h1 className="text-xl font-bold leading-tight">
              Limited Edition Combo <br /> at ₹999
            </h1>
            <p className="text-sm mt-1 font-medium">
              Exclusive designs just dropped — don't miss the{" "}
              <span className="font-semibold">Limited Offer</span>!
            </p>
          </div>
        </div>
        <div className="sm:hidden absolute bottom-20 left-0 right-0 z-20 flex justify-center bg-gray-200 p-3">
          <Link
            to={{ pathname: "/collection",  search: "?category=Combo" }}
            className="inline-block bg-black text-white hover:bg-gray-800 transition px-6 py-2 rounded-lg text-sm font-semibold shadow-md"
          >
            Shop Now
          </Link>
        </div>

        {/* Large Screen Content */}
        <div className="hidden sm:flex absolute inset-0 items-center justify-center z-20 px-4">
          <div className="text-white text-center max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              Limited Edition Combo <br /> at ₹999
            </h1>
            <p className="text-lg md:text-2xl font-semibold mb-6">
              Exclusive designs just dropped — don’t miss the{" "}
              <span className="font-semibold">Limited Offer</span>!
            </p>
            <Link
              to={{ pathname: "/collection", search: "?category=Combo" }}
              className="inline-block bg-white hover:bg-gray-300 transition text-gray-900 px-6 py-2 rounded-lg text-base md:text-lg font-semibold shadow-md"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>


      {/* Banner 2: Pick Any 4 at ₹899 */}
      <section className="relative overflow-hidden mt-6 sm:mt-8 rounded-lg z-10 h-[65vh] sm:h-[80vh] md:h-[90vh] bg-white sm:bg-transparent">
        {!imageLoaded2 && <div className="absolute inset-0 bg-gray-200 animate-pulse z-0" />}
        <img
          src={Hero2}
          alt="Pick Any 4 Banner"
          onLoad={() => setImageLoaded2(true)}
          className={`w-full h-full absolute inset-0 transition-opacity duration-700 ${
            imageLoaded2 ? "opacity-100" : "opacity-0"
          } object-contain sm:object-cover rounded-lg`}
        />
        <div className="hidden sm:block absolute inset-0 bg-black bg-opacity-50 z-10" />

        {/* Small Screen Content */}
        <div className="sm:hidden absolute top-9 left-0 p-3 right-0 z-20 flex justify-center bg-gray-50">
          <div className="text-black text-center max-w-sm">
            <h1 className="text-xl font-bold leading-tight">
              Pick Any 4 T-Shirts <br /> at ₹899 Only
            </h1>
            <p className="text-sm mt-1 font-medium">
              Stylish comfort in combos — build your own{" "}
              <span className="font-semibold">Pick 4</span> set now!
            </p>
          </div>
        </div>
        <div className="sm:hidden absolute bottom-20 left-0 right-0 z-20 flex justify-center bg-gray-200 p-3">
          <Link
            to={{ pathname: "/collection",  search: "?category=Combo"  }}
            className="inline-block bg-black text-white hover:bg-gray-800 transition px-6 py-2 rounded-lg text-sm font-semibold shadow-md"
          >
            Start Picking
          </Link>
        </div>

        {/* Large Screen Content */}
        <div className="hidden sm:flex absolute inset-0 items-center justify-center z-20 px-4">
          <div className="text-white text-center max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              Pick Any 4 T-Shirts <br /> at ₹899 Only
            </h1>
            <p className="text-lg md:text-2xl font-semibold mb-6">
              Stylish comfort in combos — build your own{" "}
              <span className="font-semibold">Pick 4</span> set now!
            </p>
            <Link
              to={{ pathname: "/collection",  search: "?category=Combo"  }}
              className="inline-block bg-white hover:bg-gray-300 transition text-gray-900 px-6 py-2 rounded-lg text-base md:text-lg font-semibold shadow-md"
            >
              Start Picking
            </Link>
          </div>
        </div>
      </section>

      
    </>
  );
};

export default Hero;
