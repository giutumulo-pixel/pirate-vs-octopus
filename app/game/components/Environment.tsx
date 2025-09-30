import styles from "../page.module.css";

type EnvironmentType = 'dawn' | 'morning' | 'highNoon' | 'afternoon' | 'sunset' | 'evening' | 'night' | 'storm' | 'fog' | 'aurora';

interface EnvironmentProps {
  level: number;
}

function getEnvironmentType(level: number): EnvironmentType {
  switch(level) {
    case 1: return 'dawn'; // Alba
    case 2: return 'morning'; // Mattino
    case 3: return 'highNoon'; // Sole Alto
    case 4: return 'afternoon'; // Pomeriggio
    case 5: return 'sunset'; // Tramonto
    case 6: return 'evening'; // Sera
    case 7: return 'night'; // Notte
    case 8: return 'storm'; // Tempesta
    case 9: return 'fog'; // Nebbia
    case 10: return 'aurora'; // Aurora Boreale
    default: return 'dawn';
  }
}

export function Environment({ level }: EnvironmentProps) {
  const environment = getEnvironmentType(level);
  
  return (
    <>
      {/* Sky - changes based on environment */}
      <div className={styles[`sky_${environment}`] || styles.sky_dawn}/>
      
      {/* Special elements for each environment */}
      {environment === 'night' && <div className={styles.moon}/>}
      {environment === 'aurora' && <div className={styles.aurora}/>}
      {environment === 'storm' && (
        <>
          <div className={styles.lightning}/>
          <div className={styles.rain}/>
        </>
      )}
      {environment === 'fog' && <div className={styles.fogOverlay}/>}
      
      <div className={styles.haze}/>
      
      {/* Water - changes based on environment */}
      <div className={styles[`water_${environment}`] || styles.water_dawn}/>
      
      {/* Ocean depth gradient overlay */}
      <div className={styles.depthGradient}/>
      
      <div className={styles.islandContainer}><div className={styles.island}/></div>
    </>
  );
}
