export default function Header() {
  return (
    <header className="bg-white border-b border-green-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-xl shadow-md">
          🎾
        </div>
        <div>
          <h1 className="text-xl font-bold text-green-800 leading-tight">Master of Tenis</h1>
          <p className="text-xs text-green-600 font-medium">Tenisová škola Ladislava Bodyna</p>
        </div>
      </div>
    </header>
  );
}
