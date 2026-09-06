import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { BackToTop } from "@/components/site/BackToTop";
import { Hero } from "@/components/site/sections/Hero";
import { About } from "@/components/site/sections/About";
import { Videos } from "@/components/site/sections/Videos";
import { Channels } from "@/components/site/sections/Channels";
import { Social } from "@/components/site/sections/Social";
import { Live } from "@/components/site/sections/Live";
import { Stats } from "@/components/site/sections/Stats";
import { Gallery } from "@/components/site/sections/Gallery";
import { Latest } from "@/components/site/sections/Latest";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "مروان ريحان",
  alternateName: "Marwan Rehan – LeOniDeS",
  jobTitle: "صانع محتوى",
  nationality: "Egyptian",
  sameAs: [
    "https://www.youtube.com/channel/UCbD4HxUyH2-sDDncYs3PjPg",
    "https://www.youtube.com/channel/UCf4UfbDfku3e3i_qggQjPRg",
    "https://www.youtube.com/channel/UCCXVX-w1Y0_c2NPI9cqTxFw",
    "https://www.twitch.tv/leonides",
    "https://www.instagram.com/marwan_rehan/",
    "https://www.facebook.com/gaming/leonides.mr",
    "https://twitter.com/MarwanRehan",
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "مروان ريحان | LeOniDeS – Gaming, Movies & Entertainment" },
      {
        name: "description",
        content:
          "الموقع الرسمي لمروان ريحان LeOniDeS: أحدث فيديوهات اليوتيوب، القنوات الرسمية، البثوث المباشرة، معرض الصور وكل حسابات التواصل.",
      },
      { property: "og:title", content: "مروان ريحان | LeOniDeS" },
      {
        property: "og:description",
        content: "جيمنج، أفلام، كوميديا وبثوث مباشرة — كل محتوى مروان ريحان في مكان واحد.",
      },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(structuredData) }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Videos />
        <Channels />
        <Stats />
        <Social />
        <Live />
        <Gallery />
        <Latest />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
