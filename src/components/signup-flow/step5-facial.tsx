
"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";
import { verifyHuman } from "@/ai/flows/human-verification";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, Loader2 } from "lucide-react";

interface Step5FacialProps {
  onNext: () => void;
  onBack: () => void;
}

export const Step5Facial: FC<Step5FacialProps> = ({ onNext, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraAccess, setHasCameraAccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const setupCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasCameraAccess(true);
    } catch (err) {
      console.error("Camera access denied:", err);
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to continue.",
        variant: "destructive",
      });
      setHasCameraAccess(false);
    }
  }, [toast]);

  useEffect(() => {
    setupCamera();
    return () => {
      // Stop camera stream on component unmount
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [setupCamera]);

  const handleVerify = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsVerifying(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");

    if (context) {
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const faceDataUri = canvas.toDataURL("image/jpeg");

      try {
        const result = await verifyHuman({ faceDataUri });
        if (result.isHuman && result.confidence > 0.7) {
          toast({
            title: "Human Verified!",
            description: `Confidence: ${(result.confidence * 100).toFixed(0)}%`,
            className: "bg-accent text-accent-foreground",
          });
          onNext();
        } else {
          toast({
            title: "Verification Failed",
            description:
              "Could not verify you as a human. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "An Error Occurred",
          description: "Something went wrong during verification.",
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    } else {
      toast({
        title: "Canvas Error",
        description: "Could not process video frame.",
        variant: "destructive",
      });
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col items-center h-full text-center">
      <h2 className="text-2xl font-headline font-semibold mb-2">
        Human Verification
      </h2>
      <p className="text-muted-foreground mb-4">
        Please position your face in the frame.
      </p>
      <div className="w-full max-w-sm aspect-square bg-muted rounded-lg overflow-hidden relative neumorphism-inset-heavy p-2 glowing-border">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover rounded-md z-10 scale-x-[-1]"
        />
        <canvas ref={canvasRef} className="hidden" />
        {!hasCameraAccess && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white z-20">
            Requesting camera...
          </div>
        )}
      </div>
      <div className="flex justify-between w-full mt-8 max-w-sm">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isVerifying}
          className="neumorphism-outset-heavy"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleVerify}
          disabled={!hasCameraAccess || isVerifying}
          className="neumorphism-outset-heavy bg-primary text-primary-foreground"
        >
          {isVerifying ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Camera className="mr-2 h-4 w-4" />
          )}
          {isVerifying ? "Verifying..." : "Verify Me"}
        </Button>
      </div>
    </div>
  );
};
