const data = [
  {
    id: "gogo",
    icon: "iconsminds-air-balloon-1",
    label: "menu.gogo",
    to: "/user/gogo",
    subs: [
      {
        icon: "simple-icon-paper-plane",
        label: "menu.start",
        to: "/user/gogo/start"
      }     
    ]
  },

  {
    id: "secondmenu",
    icon: "iconsminds-three-arrow-fork",
    label: "menu.second-menu",
    to: "/user/second-menu",
    subs: [
      {
        icon: "simple-icon-paper-plane",
        label: "menu.second",
        to: "/user/second-menu/second"
      }
    ]
  },
  {
    id: "blankpage",
    icon: "iconsminds-bucket",
    label: "menu.blank-page",
    to: "/user/blank-page"
  },
  {
    id: "docs",
    icon: "iconsminds-library",
    label: "menu.docs",
    to: "https://gogo-react-docs.coloredstrategies.com/",
    newWindow:true
  }
];
export default data;
