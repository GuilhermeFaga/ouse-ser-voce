// OUSE SER VOCÊ – Achievement Image Modal
// Modal para exibir imagem de conquista e permitir download

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, X, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAchievementImage } from "@/hooks/useAchievementImage";
import { useInstagramShare } from "@/hooks/useInstagramShare";
import { toast } from "sonner";

interface AchievementImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: {
    id: string;
    title: string;
    description: string;
    icon: string;
  };
  accentColor?: string;
}

export default function AchievementImageModal({
  isOpen,
  onClose,
  achievement,
  accentColor = "#C4856A",
}: AchievementImageModalProps) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { generateAchievementImage, downloadImage } = useAchievementImage();
  const { copyToClipboard } = useInstagramShare();

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      generateAchievementImage({
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        accentColor,
      }).then((url) => {
        setImageUrl(url);
        setLoading(false);
      });
    }
  }, [isOpen, achievement, accentColor, generateAchievementImage]);

  const handleDownload = () => {
    if (imageUrl) {
      downloadImage(imageUrl, `conquista-${achievement.id}.png`);
      toast.success("Imagem baixada! Compartilhe nos Stories 📸");
    }
  };

  const handleShareStories = () => {
    if (imageUrl) {
      // Copy image URL to clipboard for easy sharing
      copyToClipboard(
        `Desbloqueei a conquista "${achievement.title}" em OUSE SER VOCÊ! 🎉 #OuseSerVocê #30DiasParaMudar`
      );
      toast.success("Mensagem copiada! Cole nos Stories do Instagram 📸");
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F5EDE8] to-[#FAF6F1] p-4 flex items-center justify-between border-b border-[#E8D5CC]">
          <h2 className="font-semibold text-[#2C1810]">Sua Conquista</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#E8D5CC] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#8B6E5A]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Image Preview */}
          <div className="bg-[#F5EDE8] rounded-xl overflow-hidden">
            {loading ? (
              <div className="aspect-[9/14] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full border-4 border-[#E8D5CC] border-t-[#C4856A] animate-spin mx-auto mb-2" />
                  <p className="text-sm text-[#8B6E5A]">Gerando imagem...</p>
                </div>
              </div>
            ) : imageUrl ? (
              <img
                src={imageUrl}
                alt="Conquista"
                className="w-full h-auto"
              />
            ) : null}
          </div>

          {/* Info */}
          <div className="bg-[#F5EDE8] rounded-lg p-3 text-center">
            <p className="text-xs text-[#8B6E5A] mb-1">Tamanho otimizado para</p>
            <p className="text-sm font-semibold text-[#2C1810]">Instagram Stories</p>
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <Button
              onClick={handleDownload}
              disabled={loading}
              className="w-full bg-[#C4856A] hover:bg-[#B07055] text-white rounded-lg flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Baixar Imagem
            </Button>

            <Button
              onClick={handleShareStories}
              disabled={loading}
              variant="outline"
              className="w-full border-[#E8D5CC] text-[#6B4C3B] rounded-lg hover:bg-[#F5EDE8] flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Compartilhar nos Stories
            </Button>
          </div>

          {/* Tips */}
          <div className="bg-[#F5EDE8] rounded-lg p-3 border border-[#E8D5CC]">
            <p className="text-xs text-[#6B4C3B] leading-relaxed">
              💡 <strong>Dica:</strong> Baixe a imagem e compartilhe nos Stories do Instagram para inspirar outras mulheres em sua jornada!
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
