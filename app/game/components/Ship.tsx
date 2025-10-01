import styles from "../page.module.css";
import Image from "next/image";
import ShipPirate from "../../../public/ship-pirate.svg";

interface ShipProps {
  bonusActive: boolean;
}

export function Ship({ bonusActive }: ShipProps) {
  return (
    <>
      {/* Ship centered at waterline top */}
      <div className={styles.shipContainer}>
        <Image 
          src={ShipPirate} 
          alt="Pirate Ship" 
          className={styles.shipImg} 
          width={260} 
          height={120} 
          priority 
          style={{ width: 'auto', height: 'auto' }}
        />
        {/* Golden flag when bonus is active */}
        {bonusActive && <div className={styles.goldenFlag}>⚓</div>}
      </div>
      <div className={styles.pirateOnDeck} />
    </>
  );
}
