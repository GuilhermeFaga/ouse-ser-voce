// OUSE SER VOCÊ – Configurações
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Bell, User, Shield, RotateCcw, Heart } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { state, updateState, updateSettings } = useApp();
  const [name, setName] = useState(state.userName);
  const [reminderTime, setReminderTime] = useState(state.reminderTime);
  const [reminderEnabled, setReminderEnabled] = useState(state.reminderEnabled);

  const handleSaveName = () => {
    if (name.trim()) {
      updateState({ userName: name.trim() });
      toast.success("Nome atualizado!");
    }
  };

  const handleSaveReminder = () => {
    updateSettings({ reminderTime, reminderEnabled });
    toast.success("Configurações salvas!");
  };

  const handleReset = () => {
    if (window.confirm("Tem certeza? Todos os dados da jornada serão apagados.")) {
      localStorage.removeItem("ouse-ser-voce-state");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl text-[#2C1810] mb-1">Configurações</h1>
        <p className="text-[#8B6E5A] text-sm">Personalize sua experiência</p>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-2xl border border-[#F0E4DC] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#F5EDE8] flex items-center justify-center">
            <User className="w-4 h-4 text-[#C4856A]" />
          </div>
          <h3 className="font-semibold text-[#2C1810]">Perfil</h3>
        </div>
        <div className="space-y-2">
          <label className="text-xs text-[#8B6E5A] font-medium">Seu nome</label>
          <div className="flex gap-2">
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              className="border-[#E8D5CC] focus:border-[#C4856A] bg-[#FAF6F1] rounded-xl text-sm"
            />
            <Button
              onClick={handleSaveName}
              disabled={!name.trim() || name === state.userName}
              className="bg-[#C4856A] hover:bg-[#B07055] text-white rounded-xl px-4 text-sm"
            >
              Salvar
            </Button>
          </div>
        </div>
      </div>

      {/* Reminders */}
      <div className="bg-white rounded-2xl border border-[#F0E4DC] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#F5EDE8] flex items-center justify-center">
            <Bell className="w-4 h-4 text-[#C4856A]" />
          </div>
          <h3 className="font-semibold text-[#2C1810]">Lembretes</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#4A3728] font-medium">Ativar lembretes diários</p>
            <p className="text-xs text-[#8B6E5A]">Receba uma notificação para praticar</p>
          </div>
          <Switch
            checked={reminderEnabled}
            onCheckedChange={setReminderEnabled}
          />
        </div>
        {reminderEnabled && (
          <div className="space-y-2">
            <label className="text-xs text-[#8B6E5A] font-medium">Horário do lembrete</label>
            <Input
              type="time"
              value={reminderTime}
              onChange={e => setReminderTime(e.target.value)}
              className="border-[#E8D5CC] focus:border-[#C4856A] bg-[#FAF6F1] rounded-xl text-sm w-40"
            />
          </div>
        )}
        <Button
          onClick={handleSaveReminder}
          className="w-full h-10 bg-[#C4856A] hover:bg-[#B07055] text-white rounded-xl text-sm"
        >
          Salvar configurações
        </Button>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-2xl border border-[#F0E4DC] p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#F5EDE8] flex items-center justify-center">
            <Heart className="w-4 h-4 text-[#C4856A]" />
          </div>
          <h3 className="font-semibold text-[#2C1810]">Sua jornada</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#FAF6F1] rounded-xl p-3 text-center">
            <p className="font-serif text-2xl font-bold text-[#C4856A]">{state.completedDays.length}</p>
            <p className="text-xs text-[#8B6E5A]">Dias concluídos</p>
          </div>
          <div className="bg-[#FAF6F1] rounded-xl p-3 text-center">
            <p className="font-serif text-2xl font-bold text-[#C4856A]">{state.journalEntries.length}</p>
            <p className="text-xs text-[#8B6E5A]">Entradas no diário</p>
          </div>
          <div className="bg-[#FAF6F1] rounded-xl p-3 text-center">
            <p className="font-serif text-2xl font-bold text-[#C4856A]">{state.notes.length}</p>
            <p className="text-xs text-[#8B6E5A]">Anotações</p>
          </div>
          <div className="bg-[#FAF6F1] rounded-xl p-3 text-center">
            <p className="font-serif text-2xl font-bold text-[#C4856A]">{state.unlockedAchievements.length}</p>
            <p className="text-xs text-[#8B6E5A]">Conquistas</p>
          </div>
        </div>
        {state.startDate && (
          <p className="text-xs text-[#B08070] text-center mt-3">
            Jornada iniciada em {new Date(state.startDate).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        )}
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-2xl border border-[#F0E4DC] p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[#F5EDE8] flex items-center justify-center">
            <Shield className="w-4 h-4 text-[#C4856A]" />
          </div>
          <h3 className="font-semibold text-[#2C1810]">Privacidade</h3>
        </div>
        <p className="text-sm text-[#8B6E5A] leading-relaxed mb-4">
          Todos os seus dados são armazenados apenas no seu dispositivo. Nenhuma informação é enviada para servidores externos.
        </p>
      </div>

      {/* Reset */}
      <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
            <RotateCcw className="w-4 h-4 text-red-400" />
          </div>
          <h3 className="font-semibold text-[#2C1810]">Reiniciar jornada</h3>
        </div>
        <p className="text-sm text-[#8B6E5A] leading-relaxed mb-4">
          Apaga todos os dados e reinicia a jornada do zero. Esta ação não pode ser desfeita.
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
