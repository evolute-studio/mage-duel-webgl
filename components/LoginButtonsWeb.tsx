
import Image from "next/image";

export default function LoginButtonsWeb() {

  return (
    <div>
      <div className="phone-container mx-auto mb-10 scale-[0.75]">
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
