import PublicHeader from "@/components/global/public-header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="container px-4 py-6 md:py-8 md:px-6 mx-auto">
        {children}
      </main>
    </div>
  );
}
