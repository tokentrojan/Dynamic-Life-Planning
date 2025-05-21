import { useEffect, useState } from "react";

function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault(); // Prevent the default mini-infobar
      setDeferredPrompt(e);
      setShowButton(true); // Show your custom install button
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;

    // @ts-ignore
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    // @ts-ignore
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }

      setDeferredPrompt(null); // Reset the prompt
      setShowButton(false); // Hide the install button
    });
  };

  return (
    <>
      {showButton && (
        <button onClick={handleInstallClick} className="btn btn-primary">
          Install App
        </button>
      )}
    </>
  );
}

export default InstallButton;
