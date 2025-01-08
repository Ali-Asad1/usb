import { cn } from "@renderer/lib/utils";
import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import PazhanLogo from "../../assets/Pazhan_Logo.png";

const Sidebar = (): JSX.Element => {
  const navbarItems = useMemo(
    () => [
      {
        label: "Single Tone",
        href: "/single-tone",
      },
      {
        label: "Multi Tone",
        href: "/multi-tone",
      },
      {
        label: "Sweep",
        href: "/sweep",
      },
      {
        label: "Barrage",
        href: "/barrage",
      },
      {
        label: "Filtered Noise",
        href: "/filtered-noise",
      },
      {
        label: "Repeater",
        href: "/delay-doppler",
      },
    ],
    [],
  );

  return (
    <div className="flex h-screen w-64 shrink-0 flex-col bg-gradient-to-t from-accent-foreground from-10% to-primary px-3 py-5 ring">
      <h2 className="text-2xl font-bold text-accent">Noise Generator</h2>
      <div className="mt-20 space-y-5">
        {navbarItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "block rounded-md px-3 py-2 text-lg text-accent transition-colors hover:bg-primary-foreground/20",
                isActive && "pointer-events-none bg-primary-foreground/30",
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
      {/* <div className="mt-auto">
        <img src={PazhanLogo} className="w-full scale-110 rounded-lg opacity-70" alt="Logo" />
      </div> */}
    </div>
  );
};
export default Sidebar;
