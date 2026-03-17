import { useParams } from "react-router-dom";
import MarchMadness2026 from "../MarchMadness2026";

export default function BracketPage() {
  const { id } = useParams();
  return <MarchMadness2026 sharedBracketId={id} />;
}
