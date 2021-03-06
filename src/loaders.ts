/* global Promise */
export const asPromise = (loader: any) => (resourceUrl: any) => new Promise((resolve, reject) => loader.load(resourceUrl, resolve, () => { }, reject))
