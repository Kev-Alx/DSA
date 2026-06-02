const BASE_PATH = process.env.NODE_ENV === "production" ? "/DSA" : "";
export const staticLinks = [
  {
    github: "https://github.com/Kev-Alx/DSA/tree/master/sales",
    demo: "https://public.tableau.com/app/profile/kevin.alexander4206/viz/ElectronicStoreeCommerceDashboard/Dashboard1",
    detailsUrl: `${BASE_PATH}/projects/electronic-store-ecommerce`,
  },
  {
    github: "https://github.com/Kev-Alx/DSA/tree/master/acc-ugc",
    detailsUrl: `${BASE_PATH}/projects/accommodation-analysis`,
  },
  {
    github: "https://github.com/example/global-trade-war-analysis",
    detailsUrl: `${BASE_PATH}/projects/global-trade-war-analysis`,
  },
  {
    github: "#",
    demo: "https://utilsortools.vercel.app/",
    detailsUrl: `${BASE_PATH}/projects/utils-or-tools`,
    images: ["/web/utils1.png", "/web/utils2.png", "/web/utils3.png"],
  },
  {
    detailsUrl: `${BASE_PATH}/projects/index-petra`,
    images: ["/web/index1.png", "/web/index2.png", "/web/index3.png"],
  },
  {
    demo: "https://simplestchart.vercel.app/",
    detailsUrl: `${BASE_PATH}/projects/simple-chart`,
    images: ["/web/chart1.png", "/web/chart2.png", "/web/chart3.png"],
  },
];
