"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Droplets,
  Leaf,
  Sprout,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";

const uspItems = [
  {
    icon: ShieldCheck,
    title: "No Preservatives",
    desc: "No chemicals, no compromises. Only the natural goodness of herbs.",
  },
  {
    icon: Droplets,
    title: "No Artificial Colour",
    desc: "Pure ingredients with absolutely no artificial colouring.",
  },
  {
    icon: Leaf,
    title: "100% Pure Herbs",
    desc: "Premium herbs carefully selected for everyday wellness.",
  },
  {
    icon: Sprout,
    title: "Own Farm",
    desc: "Grown naturally on our own farms with complete care.",
  },
  {
    icon: HeartHandshake,
    title: "Ethical & Sustainable",
    desc: "Supporting nature while delivering trusted wellness.",
  },
];

const blogs = [
  {
    image: "/Images/Blog1.png",
    category: "WELLNESS POWDERS",
    title: "Top Health Benefits of Amla You Should Know",
    date: "10 Jul, 2026",
  },
  {
    image: "/Images/Blog2.jpg",
    category: "WELLNESS POWDERS",
    title: "Why Beetroot Deserves a Place in Your Daily Diet",
    date: "9 Jul, 2026",
  },
  {
    image: "/Images/Blog3.jpg",
    category: "WELLNESS POWDERS",
    title: "Bhringraj Powder: Benefits, Uses & How to Consume It",
    date: "7 Jul, 2026",
  },
];

export default function BlogAndUSP() {
  return (
  <section
  className="relative overflow-hidden py-24 bg-no-repeat bg-top"
  style={{
    backgroundImage: "url('/products/bg.png')",
    backgroundSize: "100% 100%",
  }}
>

      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute -left-32 top-0 h-[450px] w-[450px] rounded-full bg-[#F8E9CF]/40 blur-[120px]" />

<div className="absolute right-0 bottom-0 h-[380px] w-[380px] rounded-full bg-[#F8E9CF]/50 blur-[120px]" />

        <Image
          src="/images/leaf-left.png"
          alt=""
          width={180}
          height={400}
          className="absolute left-0 top-0 opacity-20"
        />

        <Image
          src="/images/leaf-right.png"
          alt=""
          width={180}
          height={400}
          className="absolute right-0 top-0 opacity-20"
        />

      </div>

      <div className="relative mx-auto max-w-7xl px-6">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .7 }}
          className="text-center"
        >

          <span className="rounded-full border border-[#D7C6A5] bg-white px-6 py-2 text-sm font-semibold tracking-[4px] text-[#556B2F]">

            OUR USP

          </span>

          <h2 className="mt-6 text-5xl font-black text-[#2F3E2D] font-playfair">

            Why Choose Aaushadhi?

          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-[#000000]">

            Every product reflects our dedication to purity,
            sustainability, traditional Ayurvedic wisdom,
            and complete transparency.

          </p>

        </motion.div>

        {/* USP */}

        <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
                    {uspItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.title}
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
                delay: index * 0.1,
              }}
              whileHover={{
                y: -10,
              }}
              className="group text-center"
            >

              {/* Icon */}

              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-[#D8C9AB] bg-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl">

                <Icon
                  size={36}
                  className="text-[#556B2F] transition-transform duration-500 group-hover:rotate-12"
                />

              </div>

              {/* Title */}

              <h3 className="mt-8 text-2xl font-bold text-[#5C6B2E]">

                {item.title}

              </h3>

              {/* Description */}

              <p className="mx-auto mt-3 max-w-[220px] text-[15px] leading-7 text-[#ffffff]">

                {item.desc}

              </p>

            </motion.div>
          );
        })}

      </div>

      {/* Divider */}

      <motion.div
        initial={{
          opacity: 0,
          scaleX: 0,
        }}
        whileInView={{
          opacity: 1,
          scaleX: 1,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: .8,
        }}
        className="mx-auto my-24 h-px w-40 bg-[#B59A72]"
      />

      {/* Blog Heading */}

      <motion.div
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
          duration: .6,
        }}
        className="mb-16 text-center"
      >

        <span className="rounded-full border border-[#D7C6A5] bg-white px-6 py-2 text-sm font-semibold tracking-[4px] text-[#556B2F]">

          FEATURED BLOG

        </span>

        <h2 className="mt-6 text-5xl font-black text-[#2F3E2D] font-playfair">

          Learn Ayurveda

        </h2>

        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-[#000000]">

          Explore wellness tips, herbal knowledge,
          healthy lifestyle advice and traditional
          Ayurvedic practices from our experts.

        </p>

      </motion.div>

      {/* Blog Grid */}

      <div className="grid gap-10 lg:grid-cols-3">
        {blogs.map((blog, index) => (
          <motion.article
            key={blog.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: index * 0.12,
            }}
            whileHover={{ y: -8 }}
            className="group relative flex h-full flex-col overflow-hidden rounded-[28px] transition-all duration-500"
            style={{
              background: "rgba(255,255,255,0.60)",
              backdropFilter: "blur(22px)",
              WebkitBackdropFilter: "blur(22px)",
              border: "1px solid rgba(255,255,255,0.55)",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.25)",
            }}
          >
            {/* Blog Image */}

            <div className="relative aspect-square overflow-hidden rounded-[22px] m-4 bg-[#F6EFE2]">

              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

            </div>

            {/* Content */}

            <div className="flex flex-1 flex-col px-5 pb-5 pt-2">

              {/* Category */}

              <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#5C6B2E]">

                {blog.category}

              </p>

              {/* Title */}

              <h3
                className="text-[22px] font-bold leading-tight text-[#5C6B2E]"
                style={{
                  fontFamily: "var(--font-playfair)",
                }}
              >
                {blog.title}
              </h3>

              {/* Description */}

              <p className="mt-3 text-sm leading-relaxed text-[#000000]">

                Discover expert Ayurvedic insights, natural wellness tips,
                and healthy lifestyle guidance for everyday living.

              </p>

              {/* Footer */}

              <div className="mt-auto flex items-center justify-between pt-6">

                <span className="text-sm text-[#000000] opacity-70">

                  {blog.date}

                </span>

                

              </div>

            </div>

          </motion.article>
        ))}
      </div>

    </div>

  </section>
);
}
    