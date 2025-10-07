"use client";

export default function WaitlistPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black font-body text-foreground">
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      <main className="relative z-20 flex min-h-screen w-full flex-col items-center justify-center p-4">
        {/* The video will now be a hero element within the main content area */}
        <div className="w-full max-w-4xl aspect-video rounded-lg overflow-hidden neumorphism-inset-heavy">
           <iframe
            src="https://player.cloudinary.com/embed/?cloud_name=dvsm5fbmc&public_id=215598-medium-MERGE_aifkay&profile=cld-default&autoplay=1&mute=1&loop=1&controls=0"
            width="100%"
            height="100%"
            style={{
              border: '0',
            }}
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </main>
    </div>
  );
}
