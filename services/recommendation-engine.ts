import { oklahomaMockRoster } from "@/data/mock-roster";
import type { ProgramProfile } from "@/types/program";
import type { FootballRecommendation } from "@/types/recommendation";
import {
  facilitiesInvestmentRule,
  highNeedPositionRule,
  offensiveLineDepthRule,
  prestigeInvestmentRule,
  quarterbackRecruitingRule,
  sortRecommendations,
  staffImprovementRule,
  transferPortalFallbackRule
} from "@/utils/recommendation-rules";

type RecommendationEngineInput = {
  programProfile: ProgramProfile;
};

const mockStaffRating = "B-";

export function getTopFootballOperationsRecommendations({
  programProfile
}: RecommendationEngineInput): FootballRecommendation[] {
  const positionGroups = oklahomaMockRoster.positionGroups;
  const recommendations: Array<FootballRecommendation | null> = [
    quarterbackRecruitingRule(positionGroups),
    facilitiesInvestmentRule(programProfile.school),
    offensiveLineDepthRule(positionGroups),
    prestigeInvestmentRule(programProfile.school),
    staffImprovementRule(mockStaffRating),
    transferPortalFallbackRule(positionGroups),
    ...positionGroups.map(highNeedPositionRule)
  ];

  return sortRecommendations(
    recommendations.filter(
      (recommendation): recommendation is FootballRecommendation =>
        recommendation !== null
    )
  ).slice(0, 3);
}
