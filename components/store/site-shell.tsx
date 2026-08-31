"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { selectCartCount, useShopStore } from "@/src/store/shopStore";

const navItems = [
  { href: "/", label: "New arrivals" },
  { href: "/products", label: "Shop all" },
  { href: "/products?category=womens-bags", label: "Accessories" },
  { href: "/products?category=furniture", label: "Home" },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const cartCount = useShopStore(selectCartCount);
  const wishlistCount = useShopStore((state) => state.wishlist.length);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if (event.key === "/" && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const query = search.trim();
    if (query) window.location.assign(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="site-root">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="announcement">Complimentary delivery on orders over $100 <span>— easy 30-day returns</span></div>
      <header className="site-header">
        <div className="header-main page-width">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mobile-menu-button" aria-label="Open menu"><Menu /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[88%] max-w-sm">
              <SheetHeader><SheetTitle className="brand-wordmark">NORTHLINE</SheetTitle></SheetHeader>
              <nav className="mobile-nav" aria-label="Mobile navigation">
                {navItems.map((item) => <SheetClose asChild key={item.href}><Link href={item.href}>{item.label}</Link></SheetClose>)}
                <SheetClose asChild><Link href="/wishlist">Wishlist <span>{wishlistCount}</span></Link></SheetClose>
                <SheetClose asChild><Link href="/account">Account</Link></SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
          <Link className="brand-wordmark" href="/" aria-label="Northline home">NORTHLINE</Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={pathname === item.href ? "is-current" : ""}>{item.label}</Link>
            ))}
          </nav>
          <div className="header-actions">
            <form className="header-search" onSubmit={submitSearch} role="search">
              <Search aria-hidden="true" />
              <input ref={searchRef} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" aria-label="Search products" />
              <kbd>/</kbd>
            </form>
            <Link href="/search" className="mobile-search-icon" aria-label="Search"><Search /></Link>
            <Link href="/wishlist" className="icon-link desktop-icon" aria-label={`Wishlist, ${wishlistCount} items`}><Heart /><Count value={wishlistCount} /></Link>
            <Link href="/account" className="icon-link desktop-icon" aria-label="Account"><UserRound /></Link>
            <Link href="/cart" className="icon-link" aria-label={`Shopping bag, ${cartCount} items`}><ShoppingBag /><Count value={cartCount} /></Link>
          </div>
        </div>
      </header>
      <main id="main-content">{children}</main>
      <footer className="site-footer">
        <div className="page-width footer-grid">
          <div className="footer-intro"><p className="brand-wordmark">NORTHLINE</p><p>Useful objects, quiet design, and considered materials for everyday life.</p></div>
          <div><h2>Shop</h2><Link href="/products">All products</Link><Link href="/products?category=womens-bags">Accessories</Link><Link href="/wishlist">Wishlist</Link></div>
          <div><h2>Help</h2><a href="#delivery">Delivery & returns</a><Link href="/account/orders">Track an order</Link><a href="mailto:hello@northline.store">Contact</a></div>
          <div className="newsletter"><h2>Useful notes, occasionally.</h2><p>New arrivals and studio stories, no weekly noise.</p><form onSubmit={(event) => event.preventDefault()}><label htmlFor="newsletter-email">Email address</label><div><input id="newsletter-email" type="email" required placeholder="you@example.com" /><Button type="submit">Join</Button></div></form></div>
        </div>
        <div className="page-width footer-bottom"><span>© {new Date().getFullYear()} NORTHLINE</span><span>Portfolio storefront — checkout is demonstrative.</span></div>
      </footer>
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}

function Count({ value }: { value: number }) {
  return value > 0 ? <span className="header-count" aria-hidden="true">{value > 99 ? "99+" : value}</span> : null;
}
