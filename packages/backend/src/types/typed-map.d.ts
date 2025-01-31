export interface TypedMap<T extends Object> extends Map<any, any> {
  /**
   * @returns true if an element in the Map existed and has been removed, or false if the element does not exist.
   */
  delete(key: keyof T): boolean
  /**
   * Executes a provided function once per each key/value pair in the Map, in insertion order.
   */
  forEach(
    callbackfn: <K extends keyof T>(
      value: T[K],
      key: K,
      map: Map<K, T[K]>
    ) => void,
    thisArg?: any
  ): void
  /**
   * Returns a specified element from the Map object. If the value that is associated to the provided key is an object, then you will get a reference to that object and any change made to that object will effectively modify it inside the Map.
   * @returns Returns the element associated with the specified key. If no element is associated with the specified key, undefined is returned.
   */
  get<K extends keyof T>(key: K): T[K] | undefined
  /**
   * @returns boolean indicating whether an element with the specified key exists or not.
   */
  has(key: keyof T): boolean
  /**
   * Adds a new element with a specified key and value to the Map. If an element with the same key already exists, the element will be updated.
   */
  set<K extends keyof T>(key: K, value: T[K]): this
}
