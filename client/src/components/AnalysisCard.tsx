import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { LucideIcon } from "lucide-react";
import React from "react";

interface AnalysisCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  delay?: number;
  onClick: () => void;
}

const AnalysisCard = ({ icon: Icon, title, description, gradient, delay = 0, onClick }: AnalysisCardProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] }}
      style={{ perspective: 1000 }}
      className="w-full"
    >
      <motion.button
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="group relative rounded-2xl p-[1px] text-left w-full focus:outline-none transition-shadow duration-500 hover:shadow-2xl hover:shadow-primary/20"
      >
        {/* Glow border on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Card content */}
        <div className="relative glass rounded-2xl p-8 h-full flex flex-col items-start overflow-hidden text-left">
          <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12 group-hover:scale-[1.8] group-hover:rotate-0 transition-all duration-700 pointer-events-none">
            <Icon size={80} />
          </div>

          {/* Icon */}
          <div className={`w-14 h-14 rounded-xl ${gradient} flex items-center justify-center mb-6 shadow-xl shadow-black/20 group-hover:scale-110 transition-transform duration-500`}>
            <Icon size={24} className="text-white" />
          </div>

          {/* Text */}
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300 tracking-tight">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium mb-6 flex-1">
            {description}
          </p>

          {/* Action indicator */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-[11px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <span>Initialize Protocol</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
};

export default AnalysisCard;

