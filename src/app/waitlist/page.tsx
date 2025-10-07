
"use client";

export default function WaitlistPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black font-body text-foreground">
      {/* Background Video */}
      <iframe
        src="https://player.cloudinary.com/embed/?cloud_name=dvsm5fbmc&public_id=215598-medium-MERGE_aifkay&profile=cld-default&autoplay=1&mute=1&loop=1&controls=0"
        width="1920"
        height="1080"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100vw',
          height: '100vh',
          transform: 'translate(-50%, -50%)',
          objectFit: 'cover',
          zIndex: 0,
        }}
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
        frameBorder="0"
      ></iframe>
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      <main className="relative z-20 flex min-h-screen w-full flex-col items-center justify-center p-4">
        {/* Content will go here in the next steps */}
      </main>
    </div>
  );
}
