import type { ProgramProfile } from "@/types/program";
import type { FootballRecommendation } from "@/types/recommendation";
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
  return sortOperationsRecommendations(
    buildFootballOperationsRecommendations(programProfile)
  );
}

export function getTopFootballOperationsIntelligence({
  programProfile
}: FootballOperationsEngineInput): FootballRecommendation[] {
  return getFootballOperationsRecommendations({ programProfile }).slice(0, 3);
}
