import { NavLink } from "react-router-dom";
import { Truck, Package, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const navItems = [
    { id: "articulos", label: "Artículos", icon: Package, href: "/" },
    {
      id: "precios-especiales",
      label: "Precios Especiales",
      icon: Tag,
      href: "/specialPrices",
    },
  ];

  return (
    <header className="sticky top-0 z-50">
      <div className="gradient-bg text-primary-foreground py-4 px-6 shadow-lg">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <Truck className="h-8 w-8 mr-3" />
              <h1 className="text-2xl font-bold tracking-tight">
                Challenge DRENVÍO
              </h1>
            </div>

            <nav className="flex items-center space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "nav-item flex items-center gap-2 text-white/90 hover:text-white font-medium",
                      isActive && "active text-white"
                    )
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
