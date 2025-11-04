import Header, { TtitleBar } from "../components/header";

export default function About() {
  return (<div>
      <Header/>
      <TtitleBar/>
    <div className="min-h-screen bg-gradient-to-b from-primary via-blue-300 to-primary text-black flex flex-col items-center justify-center px-6 py-16">
      
      <div className="max-w-4xl text-center">
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-accent">
          About Alipres
        </h1>
        <p className="text-black text-lg leading-relaxed mb-8">
          Welcome to <span className="text-accent font-semibold">Alipres</span> — 
          your one-stop destination for the latest gaming tech, computer accessories, 
          and cutting-edge electronics. We’re passionate about bringing you the 
          best-quality gear at affordable prices, with a focus on reliability and performance.
        </p>
        <p className="text-black text-md leading-relaxed mb-8">
          From gaming PCs to laptops, RGB setups, and high-end peripherals — 
          Alipres is built by tech enthusiasts for tech lovers.  
          Our goal is to empower gamers, creators, and professionals with tools 
          that make every moment productive and fun.
        </p>
        <p className="text-black italic">
          “Technology made simple, stylish, and affordable.”
        </p>
      </div>
    </div>
    </div>
  );
}
