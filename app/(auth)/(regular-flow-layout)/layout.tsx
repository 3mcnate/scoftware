import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	return (
		<div className="grid min-h-screen overflow-hidden lg:grid-cols-2">
		  <div className="flex flex-col gap-4 p-6 md:p-10">
			<div className="flex justify-center gap-2 md:justify-start">
			  <Link href="/" className="flex items-center gap-2 font-medium">
				<Image alt="sc outfitters logo" height={100} width={100} src="/logo.png"/>
			  </Link>
			</div>
			<div className="flex flex-1 items-center justify-center">
			  <div className="w-full max-w-sm">
				{children}
			  </div>
			</div>
		  </div>
		  <div className="bg-muted relative hidden lg:block">
			<Image
			  src="/auth-image-2.jpg"
			  alt="Image"
			  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
			  fill
			/>
		  </div>
		</div>
	  )
}