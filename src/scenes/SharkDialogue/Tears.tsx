import { AnimatePresence, motion } from 'framer-motion'
import styles from './Tears.module.css'

/**
 * Coded tears for the left shark. Positioned over its eye in the supplied
 * photo — nothing is drawn onto the artwork itself.
 */
export function Tears({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className={styles.wrap}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={styles.drop} style={{ ['--d' as string]: `${i * 0.42}s` }} />
          ))}
          <span className={styles.pool} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
