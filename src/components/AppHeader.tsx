import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
}

const AppHeader = ({ title, showBack = false }: AppHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 flex items-center h-14 px-4 bg-secondary shadow-md">
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          className="mr-3 flex items-center justify-center w-10 h-10 rounded-lg text-red-800 active:bg-red-800/80 active:text-red-800 transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      )}
      <h1 className="text-lg font-bold text-red-800 tracking-wide truncate">
        {title}
      </h1>
    </header>
  );
};

export default AppHeader;
