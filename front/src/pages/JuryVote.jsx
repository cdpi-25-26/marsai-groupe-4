import { useEffect, useState, useRef } from "react";
import {
  getEvaluations,
  getFilmsToEvaluate,
  createEvaluation,
  undoLastEvaluation,
  getFilmStats,
} from "../api/evaluations.js";
import handleLogout from "../utils/helpers.js";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

function JuryVote() {
  // TODO: Implement JuryVote component
  
  return (
    <div>
      <h1>Jury Vote</h1>
      <p>To be implemented</p>
    </div>
  );
}

export default JuryVote;
