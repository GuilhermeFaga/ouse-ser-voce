import { useState } from "react";
import { Heart, RotateCcw, Shield, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/app/store";
import { writtenDaysOf } from "@/app/state";
import { formatLongDate } from "@/lib/dates";

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <div className="w-8 h-8 rounded-lg bg-[#F5EDE8] flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-semibold text-[#2C1810]">{title}</h3>
    </div>
  );
}

export default function SettingsPage() {
  const { state, completedDays, updateName, resetAll } = useApp();
  const [name, setName] = useState(state.userName);

  const handleReset = () => {
    if (
      window.confirm("Tem certeza? Todos os dados da jornada serão apagados.")
    ) {
      resetAll();
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl text-[#2C1810] mb-1">
          Configurações
        </h1>
        <p className="text-[#8B6E5A] text-sm">Personalize sua experiência</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#F0E4DC] p-6 shadow-sm space-y-4">
        <SectionTitle
          icon={<User className="w-4 h-4 text-[#C4856A]" />}
          title="Perfil"
        />
        <div className="space-y-2">
          <label className="text-xs text-[#8B6E5A] font-medium">Seu nome</label>
          <div className="flex gap-2">
            <Input
              value={name}
              onChange={event => setName(event.target.value)}
              className="border-[#E8D5CC] focus:border-[#C4856A] bg-[#FAF6F1] rounded-xl text-sm"
            />
            <Button
              onClick={() => {
                if (!name.trim()) return;
                updateName(name.trim());
                toast.success("Nome atualizado!");
              }}
              disabled={!name.trim() || name === state.userName}
              className="bg-[#C4856A] hover:bg-[#B07055] text-white rounded-xl px-4 text-sm"
            >
              Salvar
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#F0E4DC] p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#F5EDE8] flex items-center justify-center">
            <Heart className="w-4 h-4 text-[#C4856A]" />
          </div>
          <h3 className="font-semibold text-[#2C1810]">Sua jornada</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#FAF6F1] rounded-xl p-3 text-center">
            <p className="font-serif text-2xl font-bold text-[#C4856A]">
              {completedDays.length}
            </p>
            <p className="text-xs text-[#8B6E5A]">Dias concluídos</p>
          </div>
          <div className="bg-[#FAF6F1] rounded-xl p-3 text-center">
            <p className="font-serif text-2xl font-bold text-[#C4856A]">
              {writtenDaysOf(state).length}
            </p>
            <p className="text-xs text-[#8B6E5A]">Entradas no diário</p>
          </div>
          <div className="bg-[#FAF6F1] rounded-xl p-3 text-center">
            <p className="font-serif text-2xl font-bold text-[#C4856A]">
              {state.notes.length}
            </p>
            <p className="text-xs text-[#8B6E5A]">Anotações</p>
          </div>
          <div className="bg-[#FAF6F1] rounded-xl p-3 text-center">
            <p className="font-serif text-2xl font-bold text-[#C4856A]">
              {state.unlockedAchievements.length}
            </p>
            <p className="text-xs text-[#8B6E5A]">Conquistas</p>
          </div>
        </div>
        {state.startDate && (
          <p className="text-xs text-[#B08070] text-center mt-3">
            Jornada iniciada em {formatLongDate(state.startDate)}
          </p>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-[#F0E4DC] p-6 shadow-sm">
        <SectionTitle
          icon={<Shield className="w-4 h-4 text-[#C4856A]" />}
          title="Privacidade"
        />
        <p className="text-sm text-[#8B6E5A] leading-relaxed">
          Todos os seus dados são armazenados apenas no seu dispositivo. Nenhuma
          informação é enviada para servidores externos.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
            <RotateCcw className="w-4 h-4 text-red-400" />
          </div>
          <h3 className="font-semibold text-[#2C1810]">Reiniciar jornada</h3>
        </div>
        <p className="text-sm text-[#8B6E5A] leading-relaxed mb-4">
          Apaga todos os dados e reinicia a jornada do zero. Esta ação não pode
          ser desfeita.
        </p>
        <button
          onClick={handleReset}
          className="text-sm text-red-400 hover:text-red-600 font-medium transition-colors"
        >
          Apagar todos os dados e reiniciar
        </button>
      </div>
    </div>
  );
}
