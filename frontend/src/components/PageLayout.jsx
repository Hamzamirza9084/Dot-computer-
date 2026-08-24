export default function PageLayout({ children }) {
  return (
    <div className="relative min-h-screen" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
}
