import Image from "next/image";

import feature from "../public/feature.png"
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import How from "@/components/How";
import Pricing from "@/components/Pricing";
function App() {
  return (
    <div className="w-full h-screen">
      {/* navBAr */}
      <NavBar />
      {/* hero */}
      <Hero />
      {/* how magical draw works */}
     <How />
     {/* Pricing */}
     <Pricing />
    </div>
  );
}

export default App;