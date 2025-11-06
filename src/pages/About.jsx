import Header, { TtitleBar } from "../components/header";

export default function About() {
  return (
    <div>
      <Header />
      <TtitleBar />
      <div className="min-h-screen bg-gradient-to-b from-primary via-blue-300 to-primary text-black flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-accent">
            About SnapSite
          </h1>
          <p className="text-black text-lg leading-relaxed mb-8">
            Welcome to <span className="text-accent font-semibold">SnapSite</span> — 
            your trusted destination for high-quality, ready-to-use websites. 
            We specialize in creating professional, responsive, and modern web designs 
            tailored for businesses, startups, and individuals who want to get online fast.
          </p>
          <p className="text-black text-md leading-relaxed mb-8">
            At SnapSite, we believe a website should do more than just look good — 
            it should help you grow. That’s why every site we deliver is built with 
            performance, user experience, and SEO in mind. Whether you need an eCommerce 
            store, portfolio, or business site, we’ve got the perfect solution for you.
          </p>
          <p className="text-black italic">
            “Launch your dream website — quickly, beautifully, and affordably.”
          </p>
        </div>
      </div>
    </div>
  );
}
