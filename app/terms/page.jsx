import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Terms() {
  return (
    <>
      <Navbar />
      <div className="w-screen h-screen bg-base-100 flex items-center justify-center flex-col gap-5 pt-16">
        <p className="mx-auto text-5xl text-center leading-relaxed px-4">
          There's no Terms and Service just check the box lol :)
        </p>
        <Link href={"/register"}>
          <button className="btn btn-outline btn-info">Go Back</button>
        </Link>
      </div>
    </>
  );
}
