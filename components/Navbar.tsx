"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "About Us",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export default function Navbar() {
  const pathname = usePathname();

  const { cartCount } = useCart();

  const {
    customer,
    login,
    logout,
    isLoading,
  } = useAuth();

  const [mounted, setMounted] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  /* ---------------- MOBILE MENU ---------------- */

  const mobileOverlay = mounted
    ? createPortal(
        <div
          className={`fixed inset-0 z-[9999] md:hidden transition-all duration-500 ${
            menuOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible"
          }`}
        >
          {/* Background */}

          <div
            onClick={closeMenu}
            className="absolute inset-0 bg-[#ECD7B9] backdrop-blur-xl"
          />

          {/* Close */}

          <button
            onClick={closeMenu}
            className="
            absolute
            right-6
            top-6
            z-50
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-[#556B2F]/10
            transition
            hover:bg-[#556B2F]/20
            "
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#556B2F"
              strokeWidth="2"
            >
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>

          <div className="relative flex h-full flex-col px-8 pb-10 pt-24">

            {/* Navigation */}

            <ul className="space-y-3">

              {navLinks.map((link, index) => (

                <li
                  key={link.label}
                  className={`transition-all duration-500 ${
                    menuOpen
                      ? "translate-y-0 opacity-100"
                      : "translate-y-5 opacity-0"
                  }`}
                  style={{
                    transitionDelay: `${index * 80}ms`,
                  }}
                >

                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className={`flex items-center justify-between rounded-2xl px-4 py-4 transition-all

                    ${
                      pathname === link.href
                        ? "bg-[#556B2F]/10 text-[#556B2F]"
                        : "hover:bg-[#556B2F]/5"
                    }`}
                  >

                    <span
                      className="text-[22px] font-bold"
                      style={{
                        fontFamily:
                          "var(--font-playfair)",
                      }}
                    >
                      {link.label}
                    </span>

                    {pathname === link.href && (

                      <span className="h-2 w-2 rounded-full bg-[#556B2F]" />

                    )}

                  </Link>

                </li>

              ))}

            </ul>

            {/* Divider */}

            <div className="my-7 h-px bg-[#556B2F]/10" />

            {/* Cart */}

            <Link
              href="/cart"
              onClick={closeMenu}
              className="flex items-center justify-between rounded-2xl px-4 py-4 hover:bg-[#556B2F]/5"
            >

              <span
                className="text-[22px] font-bold"
                style={{
                  fontFamily:
                    "var(--font-playfair)",
                }}
              >
                Cart
              </span>

              {cartCount > 0 && (

                <span className="rounded-full bg-[#556B2F] px-3 py-1 text-xs font-bold text-white">

                  {cartCount}

                </span>

              )}

            </Link>
                        {/* Login / Logout */}

            {!isLoading && (

              customer ? (

                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="mt-5 rounded-2xl bg-red-50 px-4 py-4 text-left text-xl font-bold text-red-600 transition hover:bg-red-100"
                >
                  Logout
                </button>

              ) : (

                <button
                  onClick={() => {
                    login();
                    closeMenu();
                  }}
                  className="mt-5 rounded-2xl bg-[#556B2F]/10 px-4 py-4 text-left text-xl font-bold text-[#556B2F] transition hover:bg-[#556B2F] hover:text-white"
                >
                  Login
                </button>

              )

            )}

            {/* Bottom Branding */}

            <div className="mt-auto pt-10 text-center">

              <p className="text-xs tracking-[6px] text-[#556B2F]/40">

                AAUSHADHI WELLNESS

              </p>

            </div>

          </div>

        </div>,
        document.body

      )

    : null;

  return (

    <>

      {/* ================= HEADER ================= */}

      <header
        className="sticky top-0 z-[100] border-b border-[#F3ECD7B9]"
        style={{
          background:
            "rgba(248,244,236,.90)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          boxShadow:
            "0 8px 30px rgba(0,0,0,.04)",
        }}
      >

        <nav className="relative mx-auto flex h-[95px] max-w-[1450px] items-center px-8">

          {/* ================= Logo ================= */}

          <Link
            href="/"
            className="group absolute left-8 flex items-center gap-4"
          >

            <Image
              src="/aaushadhi_logo.svg"
              alt="Aaushadhi"
              width={58}
              height={58}
              className="object-contain transition-all duration-500 group-hover:scale-105 group-hover:rotate-2"
            />

            <div>

              <h2
                className="text-[20px] font-bold tracking-wide text-olive"
                style={{
                  fontFamily:
                    "var(--font-playfair)",
                }}
              >
                Aaushadhi
              </h2>

              <h2
                className="-mt-1 text-[20px] font-bold tracking-wide text-olive"
                style={{
                  fontFamily:
                    "var(--font-playfair)",
                }}
              >
                Wellness
              </h2>

            </div>

          </Link>

          {/* ================= Desktop Navigation ================= */}

          <ul
            className="
            absolute
            left-1/2
            hidden
            -translate-x-1/2
            items-center
            gap-16
            md:flex
            "
          >

            {navLinks.map((link) => (

              <li key={link.label}>

                <Link
                  href={link.href}
                  className={`group relative text-[17px] font-medium tracking-wide transition-all duration-300

                  ${
                    pathname === link.href
                      ? "text-olive"
                      : "text-[#2F2F2F] hover:text-olive"
                  }`}
                >

                  {link.label}

                  <span
                    className={`absolute -bottom-2 left-0 h-[2px] bg-olive transition-all duration-300

                    ${
                      pathname === link.href
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />

                </Link>

              </li>

            ))}

          </ul>

          {/* ================= Desktop Right ================= */}

          <div
            className="
            absolute
            right-8
            hidden
            items-center
            gap-7
            md:flex
            "
          >
                        {/* Search */}

            <button
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:bg-[#556B2F]/10 hover:text-[#556B2F]"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.5-4.5" />
              </svg>
            </button>

            {/* Cart */}

            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:bg-[#556B2F]/10 hover:text-[#556B2F]"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39A2 2 0 0 0 9.7 16h9.5A2 2 0 0 0 21 14.4L23 6H6" />
              </svg>

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#556B2F] text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Divider */}

            <div className="h-6 w-px bg-[#F3ECD7B9]" />

            {/* Login */}

            {!isLoading && (
              customer ? (
                <button
                  onClick={() => logout()}
                  className="font-semibold uppercase tracking-[2px] text-[#556B2F] transition hover:text-red-600"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => login()}
                  className="font-semibold uppercase tracking-[2px] text-[#556B2F] transition hover:text-[#80964C]"
                >
                  Login
                </button>
              )
            )}

          </div>

          {/* ================= MOBILE NAV ================= */}

          <div className="absolute right-6 flex items-center gap-3 md:hidden">

            {/* Cart */}

            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:bg-[#556B2F]/10"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39A2 2 0 0 0 9.7 16h9.5A2 2 0 0 0 21 14.4L23 6H6" />
              </svg>

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#556B2F] text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Hamburger */}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="relative flex h-11 w-11 items-center justify-center rounded-xl transition hover:bg-[#556B2F]/10"
            >
              <span
                className={`absolute h-[2px] w-5 rounded-full bg-[#2F2F2F] transition-all duration-300 ${
                  menuOpen ? "rotate-45" : "-translate-y-[6px]"
                }`}
              />

              <span
                className={`absolute h-[2px] w-5 rounded-full bg-[#2F2F2F] transition-all duration-200 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />

              <span
                className={`absolute h-[2px] w-5 rounded-full bg-[#2F2F2F] transition-all duration-300 ${
                  menuOpen ? "-rotate-45" : "translate-y-[6px]"
                }`}
              />

            </button>

          </div>

        </nav>
      {/* ================= Bottom Border ================= */}

      <div
        className="h-px w-full bg-gradient-to-r from-transparent via-[#D7C5A2] to-transparent"
      />

    </header>

    {/* ================= Mobile Portal ================= */}

    {mobileOverlay}

  </>
);

}