"use client";

import { useState } from "react";
import type { FAQ, RichTextBlock } from "@/lib/types";

function renderRichText(blocks: RichTextBlock[]): string {
  return blocks
    .map((block) =>
      block.children.map((child) => child.text).join("")
    )
    .join("\n");
}

type Props = {
  faqs: FAQ[];
};

export default function FAQAccordion({ faqs }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={faq.id}
            className={`
              rounded-2xl overflow-hidden transition-all duration-300
              ${isOpen
                ? "bg-white/80 shadow-md border border-olive/10"
                : "bg-white/40 border border-olive/5 hover:bg-white/60"
              }
            `}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer group"
            >
              <span
                className={`text-sm font-semibold leading-snug pr-4 transition-colors ${
                  isOpen ? "text-olive" : "text-text-dark group-hover:text-olive"
                }`}
              >
                {faq.question}
              </span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`flex-shrink-0 text-olive/50 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-6 pb-5 text-text-muted text-sm leading-relaxed">
                {renderRichText(faq.answer)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
