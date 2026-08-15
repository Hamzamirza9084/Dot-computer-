export default function PageLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-[#050505] text-[#FAFAFA] font-sans">
      <div className="flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
}
