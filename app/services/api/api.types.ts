import { GeneralApiProblem } from "./api-problem"
import { Location, User } from "../../models"

export {
  User,
  Location
}

export type GetToken = { kind: "ok"; token: string } | GeneralApiProblem

export type GetUserResult = { kind: "ok"; user: User } | GeneralApiProblem

export type GetLocationResult = { kind: "ok"; location: Location } | GeneralApiProblem
export type GetLocationsResult = { kind: "ok"; locations: Location[] } | GeneralApiProblem
