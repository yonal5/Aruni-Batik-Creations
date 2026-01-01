import Header, { TtitleBar } from "../components/header";

export default function About() {
  return (
    <div>
      <Header />
      <TtitleBar />

      <div className="min-h-screen bg-gradient-to-b from-primary via-blue-300 to-primary text-black flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-accent">
            About Aruni Batik Creations
          </h1>

          <p className="text-black text-lg leading-relaxed mb-8">
            Welcome to{" "}
            <span className="text-accent font-semibold">Aruni Batik</span>, 
            ඔබගේ ඇඳුම ඔබේ ආත්ම විශ්වාසයත් ලස්සනත් වැඩි කරයි.
             ඔබේ රුව, හිත කියන විදිහට ලස්සනට  දකින්න කැමති ද?
              එන්න අප සමඟ එකතු වෙන්න.High quality Batik Saree, Frock, Lungi, Sarong, Shirt
          </p>

          <p className="text-black italic font-medium">
            “Aruni Batik-Handmade With Love.”
          </p><br />
          <p className="text-black italic font-medium">ඇණවුම් වට්ස්ඇප් අංකයට යොමුකරන්න.... <spam className="text-accent italic font-medium">#0711017800</spam> </p>
        </div>
      </div>
    </div>
  );
}
