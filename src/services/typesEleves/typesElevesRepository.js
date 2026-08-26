import { apiTypesElevesRepository } from "./apiTypesElevesRepository";
import { browserTypesElevesRepository } from "./browserTypesElevesRepository";
import { choisirSourcePersistance } from "../../config/persistence";

export const SOURCE_TYPES_ELEVES =
  choisirSourcePersistance(import.meta.env.VITE_TYPES_ELEVES_REPOSITORY);

export const typesElevesRepository =
  SOURCE_TYPES_ELEVES === "api"
    ? apiTypesElevesRepository
    : browserTypesElevesRepository;
