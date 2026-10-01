import React from "react";
import PresenceJournaliere from "./PresenceJournaliere";
export default function ListePresence({ cycle }) {
  return <PresenceJournaliere key={cycle} cycle={cycle} manuel />;
}
