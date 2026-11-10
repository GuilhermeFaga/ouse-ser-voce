import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, RefreshCw, Share2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  downloadImage,
  generateAchievementImage,
} from "@/lib/achievementImage";
import { quoteCategories } from "@/lib/motivationalQuotes";
import { buildStoriesCaption, copyToClipboard } from "@/share/messages";
import type { Achievement } from "@/journey";

interface AchievementImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: Pick<Achievement, "id" | "title" | "description" | "icon">;
}

export default function AchievementImageModal({
  isOpen,
  onClose,
  achievement,
}: AchievementImageModalProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [categoryId, setCategoryId] = useState("celebration");
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    generateAchievementImage({
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon,
      accentColor: "#C4856A",
      categoryId,
    }).then(url => {
      setImageUrl(url);
      setLoading(false);
    });
  }, [isOpen, achievement, categoryId, nonce]);

  const handleDownload = () => {
    if (!imageUrl) return;
    downloadImage(imageUrl, `conquista-${achievement.id}.png`);
    toast.success("Imagem baixada! Compartilhe nos Stories 📸");
  };

  const handleShareStories = async () => {
    const copied = await copyToClipboard(
      buildStoriesCaption(achievement.title)
    );
    if (!copied) {
      toast.error("Não foi possível copiar a mensagem.");
      return;
    }
    toast.success("Mensagem copiada! Cole nos Stories do Instagram 📸");
  };

  if (!isOpen) return null;

  const selectedCategory = quoteCategories.find(
    category => category.id === categoryId
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={event => event.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden my-8"
      >
        <div className="bg-gradient-to-r from-[#F5EDE8] to-[#FAF6F1] p-4 flex items-center justify-between border-b border-[#E8D5CC]">
          <h2 className="font-semibold text-[#2C1810]">Sua Conquista</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#E8D5CC] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#8B6E5A]" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-[#2C1810]">
              Escolha a mensagem inspiradora
            </label>
            <div className="grid grid-cols-2 gap-2">
              {quoteCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setCategoryId(category.id)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    categoryId === category.id
                      ? "border-[#C4856A] bg-[#F5EDE8]"
                      : "border-[#E8D5CC] bg-white hover:bg-[#FAF6F1]"
                  }`}
                >
                  <div className="text-2xl mb-1">{category.emoji}</div>
                  <div className="text-xs font-semibold text-[#2C1810]">
                    {category.name}
                  </div>
                  <div className="text-[10px] text-[#8B6E5A]">
                    {category.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedCategory && (
            <div className="bg-[#F5EDE8] rounded-lg p-3 border border-[#E8D5CC]">
              <p className="text-xs text-[#6B4C3B] leading-relaxed">
                <strong>{selectedCategory.name}:</strong>{" "}
                {selectedCategory.description}
              </p>
            </div>
          )}

          <div className="bg-[#F5EDE8] rounded-xl overflow-hidden">
            {loading ? (
              <div className="aspect-[9/14] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full border-4 border-[#E8D5CC] border-t-[#C4856A] animate-spin mx-auto mb-2" />
                  <p className="text-sm text-[#8B6E5A]">Gerando imagem...</p>
                </div>
              </div>
            ) : imageUrl ? (
              <img src={imageUrl} alt="Conquista" className="w-full h-auto" />
            ) : null}
          </div>

          <div className="bg-[#F5EDE8] rounded-lg p-3 text-center">
            <p className="text-xs text-[#8B6E5A] mb-1">
              Tamanho otimizado para
            </p>
            <p className="text-sm font-semibold text-[#2C1810]">
              Instagram Stories
            </p>
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => setNonce(value => value + 1)}
              disabled={loading}
              variant="outline"
              className="w-full border-[#E8D5CC] text-[#6B4C3B] rounded-lg hover:bg-[#F5EDE8] flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Gerar Outra Frase
            </Button>

            <Button
              onClick={handleDownload}
              disabled={loading || !imageUrl}
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

          <div className="bg-[#F5EDE8] rounded-lg p-3 border border-[#E8D5CC]">
            <p className="text-xs text-[#6B4C3B] leading-relaxed">
              💡 <strong>Dica:</strong> Escolha a categoria que mais ressoa com
              você, gere quantas frases quiser e compartilhe nos Stories do
              Instagram para inspirar outras mulheres!
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
