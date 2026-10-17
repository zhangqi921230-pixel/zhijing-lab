export function gearTravel(p, time) {
  const driverTurns = (p.rpm * time) / 60,
    drivenTurns = (driverTurns * p.driver) / p.driven;
  return {
    driverTurns,
    drivenTurns,
    pitches: driverTurns * p.driver,
    rate: (p.rpm * p.driver) / 60,
  };
}
