"use client";

import "./navbar.css";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo-wrapper">
          <h1 className="logo">Supplier Invoice Submission</h1>
          {/* <span className="tagline">Insurance Verification</span> */}
        </div>

        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <ul className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
            <li>
    <Link href="/dashboard">Dashboard</Link>
  </li>
          <li>
            <Link href="/">Invoice List</Link>
          </li>
          <li>
            <Link href="/supplierPortal">Upload Doc</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
