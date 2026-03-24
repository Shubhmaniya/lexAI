import { motion } from "framer-motion";

const FloatingBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-mesh">
    <motion.div
      className="absolute w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]"
      animate={{ 
        x: [0, 200, -100, 0], 
        y: [0, -100, 150, 0],
        scale: [1, 1.2, 0.9, 1],
      }}
      transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      style={{ top: "-10%", left: "-5%" }}
    />
    <motion.div
      className="absolute w-[400px] h-[400px] rounded-full bg-accent/10 blur-[100px]"
      animate={{ 
        x: [0, -200, 100, 0], 
        y: [0, 150, -100, 0],
        scale: [1, 0.8, 1.2, 1],
      }}
      transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
      style={{ bottom: "5%", right: "-5%" }}
    />
    <motion.div
      className="absolute w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px]"
      animate={{ 
        rotate: [0, 360],
        scale: [1, 1.1, 1],
      }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      style={{ top: "30%", left: "20%" }}
    />
  </div>
);

export default FloatingBackground;

