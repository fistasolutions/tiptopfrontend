"use client";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { toggleSidebar } from "@/store/themeConfigSlice";
import { IRootState } from "@/store";
import { useState, useEffect } from "react";
import IconCaretsDown from "@/components/icon/icon-carets-down";
import IconMenuDashboard from "@/components/icon/menu/icon-menu-dashboard";
import IconMinus from "@/components/icon/icon-minus";
import { MessageSquarePlus } from "lucide-react";
import { usePathname } from "next/navigation";
import { getTranslation } from "@/i18n";
import IconTrendingUp from "@/components/icon/icon-trending-up";
import {
  BarChart,
  BookOpen,
  Brain,
  Calendar,
  ChartBar,
  Package,
  PhoneCall,
  Settings,
  Target,
  Users,
} from "lucide-react";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { t } = getTranslation();
  const pathname = usePathname();
  const [currentMenu, setCurrentMenu] = useState<string>("");
  const [errorSubMenu, setErrorSubMenu] = useState(false);
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const semidark = useSelector(
    (state: IRootState) => state.themeConfig.semidark
  );
  const toggleMenu = (value: string) => {
    setCurrentMenu((oldValue) => {
      return oldValue === value ? "" : value;
    });
  };

  useEffect(() => {
    const selector = document.querySelector(
      '.sidebar ul a[href="' + window.location.pathname + '"]'
    );
    if (selector) {
      selector.classList.add("active");
      const ul: any = selector.closest("ul.sub-menu");
      if (ul) {
        let ele: any =
          ul.closest("li.menu").querySelectorAll(".nav-link") || [];
        if (ele.length) {
          ele = ele[0];
          setTimeout(() => {
            ele.click();
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    setActiveRoute();
    if (window.innerWidth < 1024 && themeConfig.sidebar) {
      dispatch(toggleSidebar());
    }
  }, [pathname]);

  const setActiveRoute = () => {
    let allLinks = document.querySelectorAll(".sidebar ul a.active");
    for (let i = 0; i < allLinks.length; i++) {
      const element = allLinks[i];
      element?.classList.remove("active");
    }
    const selector = document.querySelector(
      '.sidebar ul a[href="' + window.location.pathname + '"]'
    );
    selector?.classList.add("active");
  };

  return (
    <div className="dark">
      <nav
        className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] text-white-dark shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300`}
      >
        <div className="h-full bg-black">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <Link href="/" className="main-logo flex shrink-0 items-center">
              <Brain className="h-6 w-6 text-white" />
              <span className="align-middle text-2xl font-semibold dark:text-white-light lg:inline ltr:ml-1.5 rtl:mr-1.5">
                Oliver AI
              </span>
            </Link>

            <button
              type="button"
              className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 dark:text-white-light dark:hover:bg-dark-light/10 rtl:rotate-180"
              onClick={() => dispatch(toggleSidebar())}
            >
              <IconCaretsDown className="m-auto rotate-90" />
            </button>
          </div>
          <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
            <ul className="relative space-y-0.5 p-4 py-0 font-semibold">
              <li className="menu nav-item">
                <h2 className="-mx-4 mb-1 flex items-center px-7  py-3 text-xs  uppercase ">
                  <IconMinus className="hidden h-5 w-4 flex-none" />
                  <span>{t("Overview")}</span>
                </h2>

                <li className="nav-item">
                  <Link href="/admin-home" className="group">
                    <div className="flex items-center">
                      <IconMenuDashboard className="shrink-0 group-hover:!text-white" />
                      <span className="text-sm text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                        {t("Admin Access")}
                      </span>
                    </div>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/dashboard" className="group">
                    <div className="flex items-center">
                      <IconMenuDashboard className="shrink-0 group-hover:!text-white" />
                      <span className="text-sm text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                        {t("Dashboard")}
                      </span>
                    </div>
                  </Link>
                </li>
              </li>

              <h2 className="-mx-4 mb-1 flex items-center px-7 py-3 text-xs  uppercase ">
                <IconMinus className="hidden h-5 w-4 flex-none" />
                <span>{t("Products Management")}</span>
              </h2>

              <li className="nav-item">
                <ul>
                  <li className="nav-item">
                    <Link href="/products" className="group">
                      <div className="flex items-center">
                        {/* <IconMenuChat className="shrink-0 group-hover:!text-white" /> */}
                        <Package className="h-5 w-5 text-black  dark:text-[#506690] dark:group-hover:text-white-dark" />
                        <span className="text-sm text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                          {t("Products")}
                        </span>
                      </div>
                    </Link>
                  </li>
                </ul>
              </li>
              <h2 className="-mx-4 mb-1 flex items-center px-7 py-3 text-xs  uppercase ">
                <IconMinus className="hidden h-5 w-4 flex-none" />
                <span>{t("Training")}</span>
              </h2>

              <li className="nav-item">
                <ul>
                  <li className="nav-item">
                    <Link href="/live-calls" className="group">
                      <div className="flex items-center">
                        {/* <IconMenuChat className="shrink-0 group-hover:!text-white" /> */}
                        <PhoneCall className="h-5 w-5 text-black  dark:text-[#506690] dark:group-hover:text-white-dark" />
                        <span className="text-sm text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                          {t("Live Calls")}
                        </span>
                      </div>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/progress" className="group">
                      <div className="flex items-center">
                        {/* <IconMenuMailbox className="shrink-0 group-hover:!text-white" /> */}
                        <BarChart className="h-5 w-5 text-black  dark:text-[#506690] dark:group-hover:text-white-dark" />
                        <span className="text-sm text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                          {t("Progress")}
                        </span>
                      </div>
                    </Link>
                  </li>
                </ul>
              </li>
              <h2 className="-mx-4 mb-1 flex items-center px-7 py-3 text-xs  uppercase ">
                <IconMinus className="hidden h-5 w-4 flex-none" />
                <span>{t("Chat")}</span>
              </h2>

              <li className="nav-item">
                <ul>
                  <li className="nav-item">
                    <Link href="/chat" className="group">
                      <div className="flex items-center">
                        {/* <IconMenuChat className="shrink-0 group-hover:!text-white" /> */}
                        <MessageSquarePlus className="h-5 w-5 text-black  dark:text-[#506690] dark:group-hover:text-white-dark" />
                        <span className="text-sm text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                          {t("Chat")}
                        </span>
                      </div>
                    </Link>
                  </li>
                </ul>
              </li>

              <h2 className="-mx-4 mb-1 flex items-center px-7  py-3 text-xs   uppercase ">
                <IconMinus className="hidden h-5 w-4 flex-none" />
                <span>{t("Coaching & Goals")}</span>
              </h2>

              <li className="menu nav-item">
                <Link href="/coaching" className="group">
                  <div className="flex items-center">
                    {/* <IconMenuCharts className="shrink-0 group-hover:!text-white" /> */}
                    <BookOpen className="h-5 w-5 text-black  dark:text-[#506690] dark:group-hover:text-white-dark" />
                    <span className="text-sm text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                      {t("Coaching")}
                    </span>
                  </div>
                </Link>
              </li>

              <li className="menu nav-item">
                <Link href="/goals" className="group">
                  <div className="flex items-center">
                    {/* <IconMenuWidgets className="shrink-0 group-hover:!text-white" /> */}
                    <Target className="h-5 w-5 text-black  dark:text-[#506690] dark:group-hover:text-white-dark" />
                    <span className="text-sm text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                      {t("Goals")}
                    </span>
                  </div>
                </Link>
              </li>

              <li className="menu nav-item">
                <Link href="/schedule" className="group">
                  <div className="flex items-center">
                    {/* <IconMenuFontIcons className="shrink-0 group-hover:!text-white" /> */}
                    <Calendar className="h-5 w-5 text-black  dark:text-[#506690] dark:group-hover:text-white-dark" />
                    <span className="text-sm text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                      {t("Schedule")}
                    </span>
                  </div>
                </Link>
              </li>
              <h2 className="-mx-4 mb-1 flex items-center px-7  py-3 text-xs  uppercase ">
                <IconMinus className="hidden h-5 w-4 flex-none" />
                <span>{t("Team & Analytics")}</span>
              </h2>

              <li className="menu nav-item">
                <Link href="/team" className="group">
                  <div className="flex items-center">
                    {/* <IconMenuCharts className="shrink-0 group-hover:!text-white" /> */}
                    <Users className="h-5 w-5 text-black  dark:text-[#506690] dark:group-hover:text-white-dark" />
                    <span className="text-sm text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                      {t("Team Management")}
                    </span>
                  </div>
                </Link>
              </li>

              <li className="menu nav-item">
                <Link href="/team-insight" className="group">
                  <div className="flex items-center">
                    {/* <IconMenuWidgets className="shrink-0 group-hover:!text-white" /> */}
                    <ChartBar className="h-5 w-5 text-black  dark:text-[#506690] dark:group-hover:text-white-dark" />
                    <span className="text-sm text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                      {t("Team Insights")}
                    </span>
                  </div>
                </Link>
              </li>
              <h2 className="-mx-4 mb-1 flex items-center px-7  py-3 text-xs  uppercase ">
                <IconMinus className="hidden h-5 w-4 flex-none" />
                <span>{t("Settings")}</span>
              </h2>

              <li className="menu nav-item">
                <Link href="/settings" className="group">
                  <div className="flex items-center">
                    {/* <IconMenuCharts className="shrink-0 group-hover:!text-white" /> */}
                    <Settings className="h-5 w-5 text-black  dark:text-[#506690] dark:group-hover:text-white-dark" />
                    <span className="text-sm text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                      {t("Settings")}
                    </span>
                  </div>
                </Link>
              </li>
            </ul>
            <div className="sticky  p-4">
              <div className="rounded-lg bg-[#1E2436] p-4">
                <div className="flex items-center">
                  <div className="ml-3">
                    <div className="mb-2 flex items-center gap-2">
                      <IconTrendingUp className="h-6 w-6 rounded bg-gray-700 p-1 text-blue-500 " />
                      <h3 className="font-semibold text-white">Pro Features</h3>
                    </div>
                    <p className="text-sm text-[#506690]">
                      Unlock advanced AI coaching and team analytics
                    </p>
                  </div>
                </div>
                <button className="mt-3 w-full rounded-lg bg-[#282E3F] py-2 text-sm text-white transition-colors hover:bg-[#323847]">
                  Upgrade Now
                </button>
              </div>
            </div>
          </PerfectScrollbar>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
