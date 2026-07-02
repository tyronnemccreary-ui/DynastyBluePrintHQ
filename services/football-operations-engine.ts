import type { ProgramProfile } from "@/types/program";
import type { FootballRecommendation } from "@/types/recommendation";
import { getFootballOperationsIntelligence } from "@/intelligence/services/department-intelligence-service";
import {
  buildFootballOperationsRecommendations,
  sortOperationsRecommendations
} from "@/utils/football-rules";

type FootballOperationsEngineInput = {
  programProfile: ProgramProfile;
};

export function getFootballOperationsRecommendations({
  programProfile
}: FootballOperationsEngineInput): FootballRecommendation[] {
  const intelligence = getFootballOperationsIntelligence(programProfile);

  return sortOperationsRecommendations(
    buildFootballOperationsRecommendations(programProfile, intelligence)
  );
}

export function getTopFootballOperationsIntelligence({
  programProfile
}: FootballOperationsEngineInput): FootballRecommendation[] {
  return getFootballOperationsRecommendations({ programProfile }).slice(0, 3);
}
