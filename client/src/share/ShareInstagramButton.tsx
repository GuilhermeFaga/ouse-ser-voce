import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import {
  buildShareMessage,
  copyToClipboard,
  openInstagram,
  type ShareSubject,
} from "./messages";

interface ShareInstagramButtonProps {
  subject: ShareSubject;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "ghost";
}

const sizeClasses = {
  sm: "h-8 px-2 sm:px-3 text-xs",
  md: "h-10 px-3 sm:px-4 text-sm",
  lg: "h-12 px-4 sm:px-5 text-base",
};

const variantClasses = {
  primary:
    "bg-gradient-to-r from-[#F77737] to-[#FD1D1D] hover:from-[#E66626] hover:to-[#EC1C1C] text-white shadow-md",
  secondary:
    "bg-[#F0F0F0] hover:bg-[#E0E0E0] text-[#F77737] border border-[#E8D5CC]",
  ghost:
    "bg-transparent hover:bg-[#F5EDE8] text-[#F77737] border border-[#F77737]",
};

const labels: Record<ShareSubject["kind"], string> = {
  day: "Compartilhar",
  achievement: "Compartilhar",
  progress: "Compartilhar progresso",
  journey: "Compartilhar jornada",
  story: "Compartilhar história",
};

export default function ShareInstagramButton({
  subject,
  size = "md",
  variant = "primary",
}: ShareInstagramButtonProps) {
  const handleShare = async () => {
    const message = buildShareMessage(subject);
    const copied = await copyToClipboard(message);
    if (!copied) {
      toast.error("Não foi possível copiar a mensagem.");
      return;
    }
    openInstagram();
    toast.success("Mensagem copiada! Cole no Instagram 📸");
  };

  return (
    <motion.button
      onClick={handleShare}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${sizeClasses[size]} ${variantClasses[variant]}`}
    >
      <Heart className="w-4 h-4" />
      <span>{labels[subject.kind]}</span>
    </motion.button>
  );
}
