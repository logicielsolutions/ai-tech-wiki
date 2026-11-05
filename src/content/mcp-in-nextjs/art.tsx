import { Book, Bot, Door, Person, Rail, Room, Window } from "./cast";

/** Card art: one kitchen with a dining-room door for a person and the accent delivery window for an AI assistant. */
export default function Art({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden="true">
      <Room x={95} y={50} w={210} h={200} />
      <Rail x={122} y={78} w={156} n={3} />
      <Book cx={200} cy={185} w={84} />
      <Door x={80} y={160} w={36} h={90} />
      <Window x={280} y={150} w={44} />
      <Person cx={45} cy={210} />
      <Bot cx={358} cy={210} />
    </svg>
  );
}
