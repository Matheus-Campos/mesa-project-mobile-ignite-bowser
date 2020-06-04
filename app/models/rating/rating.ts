import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const RatingModel = types
  .model("Rating")
  .props({
    id: types.identifier,
    rating: types.number,
    comment: types.optional(types.string, ''),
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type RatingType = Instance<typeof RatingModel>
export interface Rating extends RatingType {}
type RatingSnapshotType = SnapshotOut<typeof RatingModel>
export interface RatingSnapshot extends RatingSnapshotType {}
