import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import jwtDecode from "jwt-decode"
import * as storage from "../../utils/storage"
import { User, UserModel } from "../user/user"
import { Location, LocationModel } from "../location/location"
import { withEnvironment } from "../extensions/with-environment"

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types
  .model("RootStore")
  .props({
    user: types.maybeNull(UserModel),
    currentUser: types.maybeNull(UserModel),
    locations: types.optional(types.array(LocationModel), []),
    currentLocation: types.maybeNull(types.reference(LocationModel)),
    loading: types.optional(types.boolean, false),
  })
  .extend(withEnvironment)
  .actions(self => ({
    afterCreate: flow(function * afterCreate() {
      const token = yield storage.loadString("@user:token")

      if (token) {
        const body: { uid: number, iat: number } = jwtDecode(token)
        self.fetchUser(body.uid)
      }
    }),

    signIn: flow(function * signIn(email: string, password: string) {
      const result = yield self.environment.api.signIn(email, password)

      if (result.kind === "ok") {
        yield storage.saveString("@user:token", result.token)
        const body: { uid: number, iat: number } = jwtDecode(result.token)
        self.fetchUser(body.uid)
      }
    }),

    fetchUser: flow(function * fetchUser(id: number) {
      self.loading = true
      const result = yield self.environment.api.getUser(id)
      self.loading = false

      console.tron.log(result.user)
      if (result.kind === "ok") {
        self.user = result.user
      }
    }),

    setCurrentUser(user: User) {
      self.currentUser = user
    },

    setCurrentLocation(location: Location) {
      self.currentLocation = location
    },

    setUser(user: User) {
      self.user = user
    },

    setLocations(locations: Location[]) {
      self.locations = locations
    }
  }))

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
