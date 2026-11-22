import { CardBox, Card, Marker } from "./cast";

/** Card art: a front-desk card file, with one guest card (the accent) pulled up and a black marker beside it. */
export default function Art({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden="true">
      <CardBox x={90} y={150} w={220} cards={5} />
      <Card x={140} y={60} w={130} lines={3} redact={[1]} />
      <Marker x={322} y={70} angle={-30} />
    </svg>
  );
}
