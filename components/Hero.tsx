"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface HeroSlide {
  id: number;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  image: string;
  primaryBtn: string;
  secondaryBtn: string;
  background: string;
}

const slides: HeroSlide[] = [
  {
    id: 1,
    badge: "EXCLUSIVE",
    title: "Your Journey Towards Better Health Starts With",
    highlight: "Nature's Finest Products",
    description:
      "Experience authentic Ayurvedic wellness with premium herbal products made from nature's finest ingredients.",
  
    image: "/Images/Img1.png",
    primaryBtn: "Shop Now",
    secondaryBtn: "About Us",
    background:
      "from-[#F8F2E6] via-[#FBF8F2] to-[#F2E5CE]",
  },

  {
    id: 2,
    badge: "BEST SELLER",
    title: "Natural Care For Your Family With",
    highlight: "Pure Herbal Products",
    description:
      "Discover products inspired by Ayurveda for immunity, nutrition and everyday wellness.",
    
    image: "/Images/Img2.png",
    primaryBtn: "Shop Now",
    secondaryBtn: "About Us",
    background:
      "from-[#F8F2E6] via-[#FBF8F2] to-[#ECDDBF]",
  },

  {
    id: 3,
    badge: "ORGANIC",
    title: "Healthy Living Begins With",
    highlight: "100% Organic Nutrition",
    description:
      "Premium-quality herbs carefully selected to help you build a healthier lifestyle.",
    image: "/Images/Img3.png",
    primaryBtn: "Shop Now",
    secondaryBtn: "About Us",
    background:
      "from-[#FAF6EE] via-[#FDFBF7] to-[#EFDDBE]",
  },

  {
    id: 4,
    badge: "LIMITED",
    title: "Ancient Ayurvedic Wisdom Meets",
    highlight: "Modern Wellness",
    description:
      "Crafted with traditional herbs and modern research for complete family wellness.",
    
    image: "/Images/Img4.png",
    primaryBtn: "Shop Now",
    secondaryBtn: "About Us",
    background:
      "from-[#F8F3EA] via-[#FDFBF8] to-[#EAD9BB]",
  },

  {
    id: 5,
    badge: "NEW ARRIVAL",
    title: "Discover Better Health Through",
    highlight: "Trusted Ayurvedic Care",
    description:
      "Bring home herbal goodness made with premium ingredients sourced from nature.",
    
    image: "/Images/Img5.png",
    primaryBtn: "Shop Now",
    secondaryBtn: "About Us",
    background:
      "from-[#F7F1E6] via-[#FCFAF5] to-[#E8D6B6]",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  const slide = useMemo(() => slides[current], [current]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () =>
    setCurrent((prev) => (prev + 1) % slides.length);

  const prevSlide = () =>
    setCurrent((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
 const textVariants = {
  hidden: {
    opacity: 0,
    x: -60,
    filter: "blur(8px)",
  },

  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as any,
    },
  },

  exit: {
    opacity: 0,
    x: 60,
    filter: "blur(8px)",
    transition: {
      duration: 0.4,
    },
  },
};

const imageVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    x: 80,
  },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    x: -80,
    transition: {
      duration: 0.4,
    },
  },
};

return (
  <section
    className="relative min-h-screen overflow-hidden bg-[#EED9BB]"
  >
    {/* Decorative Blobs */}
    <div className="absolute z-0 -top-24 -right-20 h-[420px] w-[420px] rounded-full bg-[#EED9BB]/40 blur-3xl" />

    <div className="absolute z-0 -bottom-20 -left-20 h-[300px] w-[300px] rounded-full bg-[#EED9BB]/60 blur-3xl" />
    <div
  className="
    mx-auto
    grid
    min-h-screen
    max-w-7xl
    grid-cols-1
    items-center
    gap-10
    px-6
    pt-28
    pb-10
    lg:grid-cols-2
    lg:px-10
  "
>
{/* LEFT */}

<AnimatePresence mode="wait">
  <motion.div
    key={slide.id}
    variants={textVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="relative z-20"
  >
    <span className="rounded-full border border-[#D9C4A0] bg-white/60 px-5 py-2 text-sm font-semibold tracking-[4px] text-[#355A29] backdrop-blur">
      {slide.badge}
    </span>

    <h1 className="mt-6 text-4xl font-black leading-[1.1] text-[#30412D] lg:text-5xl font-playfair">
      {slide.title}

      <span className="mt-3 block text-[#B17A32]">
        {slide.highlight}
      </span>
    </h1>

    <p className="mt-6 max-w-lg text-base leading-7 text-[#5F6258]">
      {slide.description}
    </p>

    {/* Buttons */}

    <div className="mt-10 flex flex-wrap items-center gap-4">
      <Link href="/products">
        <motion.button
          whileHover={{
            scale: 1.05,
            y: -3,
          }}
          whileTap={{
            scale: 0.95,
          }}
          className="group flex items-center gap-3 rounded-full bg-[#355A29] px-7 py-3.5 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#2B4A22]"
        >
          {slide.primaryBtn}

          <ArrowRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </motion.button>
      </Link>

      <Link href="/about">
        <motion.button
          whileHover={{
            scale: 1.04,
          }}
          whileTap={{
            scale: 0.95,
          }}
          className="rounded-full border-2 border-[#355A29] bg-white px-7 py-3.5 font-semibold text-[#355A29] shadow-md transition-all duration-300 hover:bg-[#355A29] hover:text-white"
        >
          {slide.secondaryBtn}
        </motion.button>
      </Link>
    </div>
  </motion.div>
</AnimatePresence>

{/* RIGHT */}

<AnimatePresence mode="wait">
  <motion.div
    key={slide.image}
    variants={imageVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="relative flex items-center justify-center"
  >
    {/* Glow Circle */}

    <motion.div
      animate={{
        scale: [1, 1.08, 1],
      }}
      transition={{
        repeat: Infinity,
        duration: 5,
      }}
      className="absolute -z-10 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-[#E8D5B4] via-[#F6EAD5] to-[#EFE2CC] blur-2xl"
    />

    {/* Ring */}

    <div className="absolute h-[470px] w-[470px] rounded-full border border-white/50" />

    {/* Floating Leaf */}

    <motion.div
      animate={{
        rotate: [-8, 8, -8],
        y: [-8, 8, -8],
      }}
      transition={{
        repeat: Infinity,
        duration: 7,
      }}
      className="absolute -left-10 top-24 text-6xl"
    >
      🌿
    </motion.div>

    <motion.div
      animate={{
        rotate: [8, -8, 8],
        y: [8, -8, 8],
      }}
      transition={{
        repeat: Infinity,
        duration: 6,
      }}
      className="absolute right-0 bottom-20 text-5xl"
    >
      🍃
    </motion.div>

    {/* Product Image */}

    <motion.div
      animate={{
        y: [-8, 8, -8],
      }}
      transition={{
        repeat: Infinity,
        duration: 5,
      }}
      className="relative z-20"
    >
      <Image
        src={slide.image}
        alt={slide.title}
        width={440}
        height={440}
        priority
        className="drop-shadow-[0_35px_45px_rgba(0,0,0,0.18)]"
      />
    </motion.div>
  </motion.div>
</AnimatePresence>
</div>
    {/* Navigation Buttons */}

      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-5 top-1/2 z-40 hidden -translate-y-1/2 rounded-full bg-white/80 p-2.5 shadow-xl backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-white lg:flex"
      >
        <ChevronLeft className="text-[#355A29]" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-5 top-1/2 z-40 hidden -translate-y-1/2 rounded-full bg-white/80 p-2.5 shadow-xl backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-white lg:flex"
      >
        <ChevronRight className="text-[#355A29]" />
      </button>

      {/* Bottom Pagination */}

      <div className="absolute bottom-8 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2">

        {slides.map((item, index) => (

          <button
            key={item.id}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => setCurrent(index)}
            className={`transition-all duration-500 ${
              current === index
                ? "h-3 w-10 rounded-full bg-[#355A29]"
                : "h-3 w-3 rounded-full bg-[#CBB89A] hover:bg-[#355A29]/60"
            }`}
          />

        ))}

      </div>

      {/* Slide Counter */}

      <div className="absolute bottom-8 right-8 hidden items-center gap-3 rounded-full bg-white/70 px-4 py-2.5 text-sm font-semibold text-[#355A29] shadow-lg backdrop-blur lg:flex">

        <span>
          {String(current + 1).padStart(2, "0")}
        </span>

        <div className="h-px w-10 bg-[#355A29]/40" />

        <span>
          {String(slides.length).padStart(2, "0")}
        </span>

      </div>

      {/* Scroll Indicator */}

      <motion.div
        animate={{
          y: [0, 12, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
        className="absolute bottom-6 left-6 hidden flex-col items-center gap-2 lg:flex"
      >

        <span className="rotate-180 text-xs tracking-[4px] text-[#355A29] [writing-mode:vertical-rl]">
          SCROLL
        </span>

        <div className="h-12 w-[2px] rounded-full bg-[#355A29]/30">

          <motion.div
            animate={{
              y: [0, 32, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
            className="h-3 w-[2px] rounded-full bg-[#355A29]"
          />

        </div>

      </motion.div>

    

    </section>
  );
}