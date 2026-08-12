import { motion } from 'framer-motion'

type HudProps = {
  progress: number
}

export default function Hud({ progress }: HudProps) {
  return (
    <div className="hud" aria-hidden="true">
      <div className="hud-corner tl" />
      <div className="hud-corner tr" />
      <div className="hud-corner bl" />
      <div className="hud-corner br" />

      <div className="hud-cross vertical" />
      <div className="hud-cross horizontal" />

      <motion.div
        className="hud-ring ring-a"
        animate={{ rotate: 360 }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      <motion.div
        className="hud-ring ring-b"
        animate={{ rotate: -360 }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      <motion.div
        className="hud-ring ring-c"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.35, 0.65, 0.35]
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      <div className="hud-target">
        <span />
        <i />
        <b />
      </div>

      <motion.div
        className="hud-scan-line"
        animate={{ y: ['-120%', '520%'] }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      <div className="hud-readout">
        SCAN {String(Math.round(progress)).padStart(3, '0')}%
      </div>

      <div className="hud-status">
        TARGETING
      </div>
    </div>
  )
}
