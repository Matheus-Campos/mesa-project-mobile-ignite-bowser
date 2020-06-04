import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { RatingModel } from "../rating/rating"
import { UserModel } from "../user/user"

/**
 * Model description here for TypeScript hints.
 */
export const LocationModel = types
  .model("Location")
  .props({
    id: types.identifier,
    lat: types.number,
    lng: types.number,
    name: types.string,
    street: types.string,
    streetNumber: types.string,
    complement: types.optional(types.string, ''),
    district: types.string,
    city: types.string,
    state: types.string,
    country: types.string,
    zipcode: types.string,
    createdAt: types.Date,
    updatedAt: types.Date,
    user: UserModel,
    ratings: types.optional(types.array(RatingModel), [])
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type LocationType = Instance<typeof LocationModel>
export interface Location extends LocationType {}
type LocationSnapshotType = SnapshotOut<typeof LocationModel>
export interface LocationSnapshot extends LocationSnapshotType {}
