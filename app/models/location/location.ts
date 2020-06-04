import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { RatingModel } from "../rating/rating"
import { UserModel } from "../user/user"

/**
 * Model description here for TypeScript hints.
 */
export const LocationModel = types
  .model("Location")
  .props({
    id: types.identifierNumber,
    lat: types.number,
    lng: types.number,
    name: types.string,
    street: types.string,
    streetNumber: types.string,
    complement: types.maybe(types.string),
    district: types.string,
    city: types.string,
    state: types.string,
    country: types.string,
    zipcode: types.string,
    createdAt: types.Date,
    updatedAt: types.Date,
    user: UserModel,
    ratings: types.maybe(types.array(RatingModel))
  })
  .views(self => ({
    get avgRating() {
      if (!self.ratings.length) return 0
      const ratingsSum = self.ratings.map(r => r.rating).reduce((prev, acc) => prev + acc, 0)
      return ratingsSum / self.ratings.length
    }
  }))
  .actions(self => ({
    rate: flow(function * rate(userId: number, rating: number, comment: string) {
      try {
        yield new Promise(resolve => setTimeout(resolve, 2000))
        const newRating = RatingModel.create({ id: Math.random(), rating, comment })
        self.ratings.push(newRating)
      } catch (err) {
        console.tron.log('error')
      }
    })
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

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
