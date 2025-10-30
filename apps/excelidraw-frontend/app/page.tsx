import Hero from "@/components/hero/Hero";
import NavBar from "@/components/NavBar";
import { ScrollBasedVelocityDemo } from "@/components/ScrollBasedVelocityDemo";


function App() {
   
  return (
    <div className="">
      <NavBar/>
       <Hero />
       <ScrollBasedVelocityDemo />

    </div>
  );
}

export default App;