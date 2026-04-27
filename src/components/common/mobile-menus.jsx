import React,{useState} from "react";
import Link from "next/link";
import { mobile_menu } from "@/data/menu-data";

const MENU_META = {
  Home: "Start here",
  Shop: "Retail skincare",
  Machines: "Professional devices",
  "For Clinics": "Clinical access",
  Support: "Contact and help",
};

const MobileMenus = () => {
  const [isActiveMenu,setIsActiveMenu] = useState("")

  // handleOpenSubMenu
  const handleOpenSubMenu = (title) => {
    if(title === isActiveMenu){
      setIsActiveMenu("")
    }
    else {
      setIsActiveMenu(title)
    }
  }

  return (
    <>
      <nav className="tp-main-menu-content">
        <ul className="aura-mobile-menu-list">
          {mobile_menu.map((menu) => (
            <li
              key={menu.id}
              className={`aura-mobile-menu-item ${menu.sub_menu ? "has-dropdown" : ""} ${isActiveMenu === menu.title ? "dropdown-opened" : ""}`}
            >
              {menu.homes ? (
                <Link href={menu.link} prefetch={false} className="aura-mobile-menu-link">
                  <span className="aura-mobile-menu-title">{menu.title}</span>
                  <span className="aura-mobile-menu-meta">{MENU_META[menu.title]}</span>
                </Link>
              ) : menu.sub_menu ? (
                <>
                  <div className={`${isActiveMenu === menu.title ? 'expanded' : ''} aura-mobile-menu-link`} aria-expanded={isActiveMenu === menu.title}>
                    <span className="aura-mobile-menu-title">{menu.title}</span>
                    <span className="aura-mobile-menu-meta">{MENU_META[menu.title]}</span>
                    <button
                      type="button"
                      onClick={() => handleOpenSubMenu(menu.title)}
                      className={`dropdown-toggle-btn ${isActiveMenu === menu.title ? 'dropdown-opened' : ''}`}
                      aria-label={`Toggle ${menu.title} menu`}
                    >
                      <i className="fa-solid fa-angle-right"></i>
                    </button>
                  </div>
                  <ul className={`tp-submenu aura-mobile-submenu ${isActiveMenu === menu.title ? 'active' : ''}`}>
                    {menu.sub_menus.map((item, index) => (
                      <li key={index}>
                        <Link href={item.link} prefetch={false}>{item.title}</Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link href={menu.link} prefetch={false} className="aura-mobile-menu-link">
                  <span className="aura-mobile-menu-title">{menu.title}</span>
                  <span className="aura-mobile-menu-meta">{MENU_META[menu.title]}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default MobileMenus;
