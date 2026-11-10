import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Download, Lightbulb, RefreshCw, Share2, X } from "lucide-react";
import { toast } from "sonner";
import { Action, Field, fieldInputClass, focusRing } from "@/components/ds";
import { cn } from "@/lib/utils";
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

const focusableSelector =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function AchievementImageModal({
  isOpen,
  onClose,
  achievement,
}: AchievementImageModalProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [categoryId, setCategoryId] = useState("celebration");
  const [nonce, setNonce] = useState(0);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const reduceMotion = useReducedMotion();

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

  // Focus moves into the dialog, the page behind stops scrolling, and closing
  // returns focus to whatever opened it.
  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      opener?.focus?.();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(focusableSelector)
      ).filter(element => element.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const handleDownload = () => {
    if (!imageUrl) return;
    downloadImage(imageUrl, `conquista-${achievement.id}.png`);
    toast.success("Imagem baixada. Compartilhe nos Stories.");
  };

  const handleShareStories = async () => {
    const copied = await copyToClipboard(
      buildStoriesCaption(achievement.title)
    );
    if (!copied) {
      toast.error("Não foi possível copiar a mensagem.");
      return;
    }
    toast.success("Mensagem copiada. Cole nos Stories.");
  };

  if (!isOpen) return null;

  const selectedCategory = quoteCategories.find(
    category => category.id === categoryId
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="achievement-image-title"
        tabIndex={-1}
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        onClick={event => event.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl focus:outline-none sm:max-h-[88vh] sm:rounded-2xl"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line bg-surface-soft px-4 py-3">
          <div className="min-w-0">
            <h2
              id="achievement-image-title"
              className="font-serif text-lg text-ink"
            >
              Sua conquista
            </h2>
            <p className="mt-0.5 truncate text-xs text-ink-muted">
              {achievement.title}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-white hover:text-ink",
              focusRing
            )}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto p-5">
          <Field
            label="Mensagem da imagem"
            htmlFor="quote-category"
            hint={
              selectedCategory
                ? `${selectedCategory.name}: ${selectedCategory.description}`
                : "A frase que aparece na arte"
            }
          >
            <select
              id="quote-category"
              aria-describedby="quote-category-hint"
              value={categoryId}
              onChange={event => setCategoryId(event.target.value)}
              className={cn(fieldInputClass(), "h-11 py-0")}
            >
              {quoteCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>

          <div className="overflow-hidden rounded-xl border border-line bg-surface-soft">
            {loading ? (
              <div className="flex aspect-[9/14] items-center justify-center">
                <div className="text-center">
                  <div
                    className="mx-auto mb-2 h-10 w-10 animate-spin rounded-full border-4 border-line-strong border-t-brand motion-reduce:animate-none"
                    aria-hidden
                  />
                  <p className="text-sm text-ink-muted" role="status">
                    Gerando a imagem
                  </p>
                </div>
              </div>
            ) : imageUrl ? (
              <img
                src={imageUrl}
                alt={`Imagem da conquista ${achievement.title}`}
                className="h-auto w-full"
              />
            ) : (
              <p className="p-6 text-center text-sm leading-relaxed text-ink-muted">
                Não foi possível gerar a imagem. Tente outra mensagem.
              </p>
            )}
          </div>
          <p className="text-xs leading-relaxed text-ink-muted">
            Formato dos Stories do Instagram, pronto para baixar.
          </p>

          <div className="space-y-2">
            <Action
              block
              size="lg"
              onClick={handleDownload}
              disabled={loading || !imageUrl}
              icon={<Download className="h-4 w-4" aria-hidden />}
            >
              Baixar imagem
            </Action>
            <Action
              block
              variant="secondary"
              onClick={handleShareStories}
              disabled={loading}
              icon={<Share2 className="h-4 w-4" aria-hidden />}
            >
              Copiar legenda para os Stories
            </Action>
            <Action
              block
              variant="secondary"
              onClick={() => setNonce(value => value + 1)}
              disabled={loading}
              icon={<RefreshCw className="h-4 w-4" aria-hidden />}
            >
              Gerar outra frase
            </Action>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-line bg-brand-wash p-3">
            <Lightbulb
              className="mt-0.5 h-4 w-4 shrink-0 text-brand-ink"
              aria-hidden
            />
            <p className="text-xs leading-relaxed text-ink-soft">
              A imagem é montada aqui no seu dispositivo, com a frase da
              categoria escolhida. Nada é enviado para fora dele.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
