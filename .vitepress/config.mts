import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Claper documentation",
  description: "Documentation to use and host Claper on your own server.",
  head: [["link", { rel: "icon", type: "image/png", href: "/favicon.png" }]],
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Website", link: "https://claper.co" },
      { text: "Claper Cloud", link: "https://app.claper.co" },
    ],

    logo: "/logo.svg",
    siteTitle: false,

    search: {
      provider: "local",
    },

    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "What is Claper ?", link: "/" },
          { text: "Getting started", link: "/introduction/getting-started" },
        ],
      },
      {
        text: "Self-hosting",
        items: [
          { text: "Prerequisites", link: "/self-hosting/prerequisites" },
          { text: "Quick start", link: "/self-hosting/quick-start" },
          { text: "Configuration", link: "/self-hosting/configuration" },
          { text: "Updating", link: "/self-hosting/updating" },
          {
            text: "Development environment",
            link: "/self-hosting/development",
          },
        ],
      },
      {
        text: "Using Claper",
        items: [
          { text: "Account", link: "/usage/account" },
          {
            text: "Create your first presentation",
            link: "/usage/presentation",
          },
          { text: "Manager", link: "/usage/manager" },
          { text: "Questions and Answers", link: "/usage/qa" },
          { text: "Forms", link: "/usage/forms" },
          { text: "Polls", link: "/usage/polls" },
          { text: "Web Content", link: "/usage/webcontent" },
          { text: "Reports", link: "/usage/reports" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/ClaperCo" }],
  },
});
