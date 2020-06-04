import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as storage from "../../utils/storage"
import * as Types from "./api.types"

/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance

  /**
   * Configurable options.
   */
  config: ApiConfig

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })

    this.apisauce.addAsyncRequestTransform(request => async () => {
      const token = await storage.loadString("@user:token")

      if (token) {
        request.headers.Authorization = `Bearer ${token}`
      }
    })
  }

  /**
   * Log in an user
   */
  async signIn(email: string, password: string): Promise<Types.GetToken> {
    const response: ApiResponse<any> = await this.apisauce.post('/sign_in', {
      email, password
    })

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const token: string = response.data.token
      return { kind: "ok", token }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Sign up an user
   */
  async signUp(
    username: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ): Promise<Types.GetUserResult> {
    const response: ApiResponse<any> = await this.apisauce.post('/sign_up', {
      username,
      email,
      password,
      // eslint-disable-next-line @typescript-eslint/camelcase
      password_confirmation: passwordConfirmation
    })

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const resultUser: Types.User = {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
      }
      return { kind: "ok", user: resultUser }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Gets a location by ID
   */
  async getLocation(id: number): Promise<Types.GetLocationResult> {
    const response: ApiResponse<any> = await this.apisauce.get(`api/v1/locations/${id}`)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    const convertRating = raw => {
      return {
        id: raw.id,
        rating: raw.rating,
        comment: raw.comment,
      }
    }

    try {
      const resultLocation: Types.Location = {
        id: response.data.id,
        lat: response.data.lat,
        lng: response.data.lng,
        name: response.data.name,
        street: response.data.street,
        streetNumber: response.data.street_number,
        complement: response.data.complement,
        district: response.data.district,
        city: response.data.city,
        state: response.data.state,
        country: response.data.country,
        zipcode: response.data.zipcode,
        createdAt: response.data.created_at,
        updatedAt: response.data.updated_at,
        user: {
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
        },
        ratings: response.data.ratings.map(convertRating),
      }
      return { kind: "ok", location: resultLocation }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Gets a list of users.
   */
  async getLocations(): Promise<Types.GetLocationsResult> {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`api/v1/locations`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    const convertLocation = raw => {
      return {
        id: raw.id,
        lat: raw.lat,
        lng: raw.lng,
        name: raw.name,
        street: raw.street,
        streetNumber: raw.street_number,
        complement: raw.complement,
        district: raw.district,
        city: raw.city,
        state: raw.state,
        country: raw.country,
        zipcode: raw.zipcode,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
        user: {
          id: raw.user.id,
          username: raw.user.username,
          email: raw.user.email,
        },
      }
    }

    // transform the data into the format we are expecting
    try {
      const rawLocations = response.data.locations
      const resultLocations: Types.Location[] = rawLocations.map(convertLocation)
      return { kind: "ok", locations: resultLocations }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Gets a single user by ID
   */

  async getUser(id: number): Promise<Types.GetUserResult> {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`api/v1/users/${id}`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const resultUser: Types.User = {
        id: response.data.id,
        username: response.data.name,
        email: response.data.email,
      }
      return { kind: "ok", user: resultUser }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Updates a single user by ID
   */
  async updateUser(
    id: number,
    username: string,
    email: string,
    password: string,
    newPassword: string
  ): Promise<Types.GetUserResult> {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.put(`api/v1/users/${id}`, {
      username,
      email,
      password,
      // eslint-disable-next-line @typescript-eslint/camelcase
      new_password: newPassword,
    })

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const resultUser: Types.User = {
        id: response.data.id,
        username: response.data.name,
        email: response.data.email,
      }
      return { kind: "ok", user: resultUser }
    } catch {
      return { kind: "bad-data" }
    }
  }
}
