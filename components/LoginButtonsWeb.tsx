import { useAccount } from "@starknet-react/core";
import { ControllerWindow } from "./WalletConnector";
import { UnityWindow } from "./UnityPlayer";
import Image from "next/image";
import { useState } from "react";

export default function LoginButtonsWeb() {
  const { address, account } = useAccount();
  const [isGuest, setIsGuest] = useState(false);

  async function handleLogin() {
    const win = window as ControllerWindow;
    const handleConnect = win.handleConnect;
    if (!handleConnect) {
      throw new Error("Handle connect not initialized");
    }
    await handleConnect();
  }

  function handleGuestLogin() {
    (window as UnityWindow).unityConnector.OnGuestLogin();
    setIsGuest(true);
  }

  if (account || address || isGuest) {
    return (
      <div className="rounded-xl max-w-[80%]">
        <div className="phone-container mx-auto mb-10 scale-[0.8]">
          <Image
            src="/phone.png"
            className="phone-rotate"
            alt="Rotate your device"
            width={300}
            height={200}
            priority
          />
        </div>
        <h2
          className="m-0 mb-4 text-3xl font-bold text-center text-outline max-w-50"
          style={{ color: "white" }}
        >
          Rotate Device to Play
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-5 text-2xl min-h-[268px] justify-end">
      <button
        onClick={handleLogin}
        className="text-outline relative cursor-pointer hover:opacity-85 transition-opacity w-60 flex items-center justify-center"
      >
        <img
          src="/login-button.png"
          alt="Login"
          className="w-full inset-0 -z-10"
        />
        <span className="absolute inset-0 flex items-center justify-center pb-3 pl-3">
          Login
        </span>
      </button>
      <button
        className="text-outline relative cursor-pointer hover:opacity-85 transition-opacity w-60 flex items-center justify-center"
        onClick={handleGuestLogin}
      >
        <img
          src="/guest-button.png"
          alt="Guest Mode"
          className="w-full inset-0 -z-10"
        />
        <span className="absolute inset-0 flex items-center justify-center pb-3 pl-3">
          Guest Mode
        </span>
      </button>
    </div>
  );
}
