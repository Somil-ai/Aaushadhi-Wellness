"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Leaf,
  FlaskConical,
  PackageCheck,
  Sprout,
  ArrowRight,
} from "lucide-react";

export default function BrandStory() {
  const features = [
    {
      icon: <Sprout size={30} />,
      title: "Own Farm",
      desc: "Cultivated with care using sustainable farming practices.",
    },
    {
      icon: <PackageCheck size={30} />,
      title: "Pure Products",
      desc: "100% natural ingredients with no harmful chemicals.",
    },
    {
      icon: <FlaskConical size={30} />,
      title: "Pure Process",
      desc: "Traditional Ayurvedic processing preserving natural goodness.",
    },
    {
      icon: <Leaf size={30} />,
      title: "Careful Harvest",
      desc: "Harvested at the perfect stage for maximum potency.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#ECD7B9] py-28">
      {/* Background Blur */}

      <div className="absolute inset-0 overflow-hidden">

        <motion.div
          animate={{
            y: [-20, 20, -20],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
          className="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-[#FFF7EB]/40 blur-[120px]"
        />

        <motion.div
          animate={{
            y: [20, -20, 20],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
          }}
          className="absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-[#E9DCC7]/40 blur-[120px]"
        />

      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-20 px-6 lg:grid-cols-2">

        {/* Left Image */}

        <motion.div
          initial={{
            opacity: 0,
            x: -80,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
          }}
          className="relative"
        >

          {/* Decorative Border */}

          <div className="absolute -left-5 -top-5 h-full w-full rounded-[40px] border border-[#D8C8A8]" />

          <motion.div
            whileHover={{
              scale: 1.03,
            }}
            transition={{
              duration: 0.5,
            }}
            className="overflow-hidden rounded-[40px] shadow-[0_30px_70px_rgba(0,0,0,.12)]"
          >

            <Image
              src="/products/farm.png"
              alt="Pure Herbal Products"
              width={700}
              height={800}
              className="h-[650px] w-full object-cover transition duration-700 hover:scale-110"
              priority
            />

          </motion.div>

          {/* Floating Badge */}

          <motion.div
            animate={{
              y: [-8, 8, -8],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="absolute -bottom-8 left-8 rounded-2xl bg-white px-8 py-5 shadow-xl"
          >

            <p className="text-4xl font-bold text-[#556B2F]">

              100%

            </p>

            <p className="mt-1 text-sm font-semibold tracking-[3px] text-[#000000] uppercase">

              Organic

            </p>

          </motion.div>

        </motion.div>

        {/* Right Content */}

        <motion.div
          initial={{
            opacity: 0,
            x: 80,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: .8,
          }}
        >

          <span className="inline-flex rounded-full border border-[#D7C6A5] bg-white px-5 py-2 text-sm font-semibold tracking-[4px] text-[#556B2F]">

            OUR PROMISE

          </span>

         <h2 className="mt-8 text-5xl font-black leading-tight text-[#324B20] font-playfair">

            100% Pure <br />

            Herbal Products

          </h2>

          <p className="mt-8 text-lg leading-10 text-[#4B463D]">

            Everything we create begins with nature.

            From carefully cultivated herbs grown on our own farms

            to traditional Ayurvedic processing methods,

            every product reflects our commitment to purity,

            transparency, sustainability, and holistic wellness.

          </p>
                    {/* Features */}

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">

            {features.map((feature, index) => (

              <motion.div
                key={feature.title}
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                }}
                whileHover={{
                  y: -8,
                }}
                className="group flex items-start gap-5 rounded-3xl border border-[#E2D5BC] bg-white/70 p-5 backdrop-blur-md shadow-sm transition-all duration-500 hover:border-[#556B2F] hover:bg-white hover:shadow-xl"
              >

                {/* Icon */}

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-[#556B2F] bg-[#F8F4EC] text-[#556B2F] transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-[#556B2F] group-hover:text-white">

                  {feature.icon}

                </div>

                {/* Content */}

                <div>

                  <h3 className="text-xl font-bold text-[#5C6B2E]">

                    {feature.title}

                  </h3>

                  <p className="mt-2 text-[15px] leading-7 text-[#000000]">

                    {feature.desc}

                  </p>

                </div>

              </motion.div>

            ))}

          </div>

          {/* CTA */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: .5,
              duration: .6,
            }}
            className="mt-14"
          >

            <Link
              href="/about"
              className="group inline-flex items-center gap-4 rounded-full bg-[#355A29] px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-500 hover:-translate-y-1 hover:bg-[#5C6B2E] hover:shadow-2xl"
            >

              Discover Our Story

              <ArrowRight
                size={22}
                className="transition-transform duration-300 group-hover:translate-x-2"
              />

            </Link>

          </motion.div>

        </motion.div>

      </div>
            {/* Decorative Leaves */}

      <motion.div
        animate={{
          y: [-8, 8, -8],
          rotate: [-5, 5, -5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-6 top-24 hidden opacity-20 lg:block"
      >
        
      </motion.div>

      <motion.div
        animate={{
          y: [8, -8, 8],
          rotate: [5, -5, 5],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute bottom-16 right-6 hidden opacity-20 lg:block"
      >
        
      </motion.div>

      {/* Bottom Decoration */}

      <div className="pointer-events-none absolute bottom-0 left-0 h-56 w-full bg-gradient-to-t from-[#EFE4CF]/60 to-transparent" />

    </section>
  );
}
