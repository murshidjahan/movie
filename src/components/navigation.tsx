"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";

import Search from "@/components/Search"; // Import your Search component here

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ModeToggle } from "./Mode-Toggle";

const links = [
  { label: "Home", href: "/home" },
  
  { label: "Movie", href: "/movie" },

  { label: "TV Shows", href: "/tv" },

  { label: "Trending", href: "/trending" },

  { label: "About", href: "/about" },
];

export function NavigationBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLinkClick = () => setIsOpen(false);

  return (
    <div className="flex items-center justify-between px-6 py-3 m-2 sticky top-0 z-50 bg-[color:var(--background)]/70 backdrop-blur-md border-b border-[color:var(--border)] rounded-2xl border-2 transition-all duration-300 ease-in-out animate-fadeInUp">
      {/* Left side: Logo + Desktop nav */}
      <div className="flex items-center space-x-8">
        <Link href="/" className="flex items-center">
          <span className="ml-2 font-bold text-lg text-[color:var(--foreground)]">
            Movie Life
          </span>
        </Link>

        {/* Desktop navigation menu */}
        <NavigationMenu className="hidden md:block">
          <NavigationMenuList className="flex gap-4">
            {links.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <NavigationMenuItem key={label}>
                  <NavigationMenuLink asChild active={isActive}>
                    <Link
                      href={href}
                      aria-current={isActive ? "page" : undefined}
                      className={`relative text-sm font-medium transition-colors duration-300 ease-in-out ${
                        isActive
                          ? "text-[color:var(--primary)]"
                          : "text-[color:var(--foreground)] hover:text-[color:var(--primary)]"
                      }`}
                    >
                      {label}
                      <span
                        className={`absolute left-0 -bottom-0.5 h-0.5 w-full origin-left transform scale-x-0 transition-transform duration-300 ease-out ${
                          isActive
                            ? "scale-x-100 bg-[color:var(--primary)]"
                            : "hover:scale-x-100 bg-[color:var(--primary)]"
                        }`}
                      />
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Desktop Search */}
        <div className="hidden md:block w-64">
          <Search />
        </div>

        {/* Desktop Theme Toggle */}
        <div className="hidden md:flex items-center gap-4">
          <ModeToggle />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger aria-label="Open menu">
              <MenuIcon className="h-6 w-6 text-[color:var(--foreground)]" />
            </SheetTrigger>
            <SheetContent
              side="left"
              className="bg-[color:var(--background)] border-r border-[color:var(--border)] flex flex-col justify-between"
            >
              <div>
                <SheetHeader className="flex items-center justify-between px-6 py-4 border-b border-[color:var(--border)]">
                  <SheetTitle className="text-xl font-bold text-center flex-grow">
                    Movie Life
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Search */}
                <div className="px-6 mt-4">
                  <Search />
                </div>

                {/* Mobile Links */}
                <nav className="mt-6 flex flex-col gap-5 px-6">
                  {links.map(({ label, href }) => {
                    const isActive = pathname === href;
                    return (
                      <Link
                        key={label}
                        href={href}
                        onClick={handleLinkClick}
                        className={`text-base font-medium transition-colors duration-200 ${
                          isActive
                            ? "text-[color:var(--primary)]"
                            : "text-[color:var(--foreground)] hover:text-[color:var(--primary)]"
                        }`}
                      >
                        {label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Mobile Theme Toggle */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-[color:var(--border)] md:hidden">
                <ModeToggle />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
