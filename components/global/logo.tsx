import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-4">
      <Image src="/logo.png" height={100} width={100} alt="logo" />
    </Link>
  );
}
