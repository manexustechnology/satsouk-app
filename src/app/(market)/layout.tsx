import Navbar from "@/components/Navbar";

export default function MarketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mt-[74px] inset-0 m-auto">
        {children}
      </div>
    </>
  )
}