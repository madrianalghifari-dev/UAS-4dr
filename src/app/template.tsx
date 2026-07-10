export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="animate-in slide-in-from-right-8 fade-in duration-500 fill-mode-both flex-1 w-full flex flex-col">
      {children}
    </div>
  );
}
