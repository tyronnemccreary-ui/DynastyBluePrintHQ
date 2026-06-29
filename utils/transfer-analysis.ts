import type {
  EvaluatedTransfer,
  ProjectedImpact,
  TransferFitGrade,
  TransferPlayer,
  TransferRecommendation
} from "@/types/transfer";
import type { NeedLevel } from "@/types/roster";

const needScore: Record<NeedLevel, number> = {
  High: 3,
  Medium: 2,
  Low: 1
};

const fitScore: Record<TransferFitGrade, number> = {
  Excellent: 3,
  Good: 2,
  Limited: 0
};

const impactScore: Record<ProjectedImpact, number> = {
  "Immediate Starter": 3,
  "Strong Rotation": 2,
  "Development Prospect": 1,
  "Not Recommended": 0
};

export function evaluateTransfers(transfers: TransferPlayer[]): EvaluatedTransfer[] {
  return transfers.map((transfer) => ({
    ...transfer,
    recommendation: getTransferRecommendation(transfer),
    explanation: getTransferExplanation(transfer)
  }));
}

function getTransferRecommendation(transfer: TransferPlayer): TransferRecommendation {
  const score =
    needScore[transfer.positionNeed] +
    fitScore[transfer.schemeFit] +
    fitScore[transfer.rosterFit] +
    fitScore[transfer.scholarshipValue] +
    impactScore[transfer.projectedImpact];

  if (score >= 12) {
    return "Should Pursue";
  }

  if (score >= 8) {
    return "Maybe Pursue";
  }

  return "Pass";
}

function getTransferExplanation(transfer: TransferPlayer) {
  if (transfer.projectedImpact === "Immediate Starter") {
    return `${transfer.position} is a high-need room and this player can help immediately without waiting on development.`;
  }

  if (transfer.positionNeed === "High") {
    return `${transfer.position} remains a roster need, but fit and timeline should be checked before using a scholarship.`;
  }

  if (transfer.positionNeed === "Low") {
    return `${transfer.position} is not a priority need, so the scholarship is better protected for thinner rooms.`;
  }

  return `${transfer.position} has some need value, but the staff should compare this option against high school recruiting first.`;
}
