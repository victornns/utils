export default ({ app }, inject) => {

  const isObject = (x) => typeof x === 'object' && x !== null
  const suffix = (str) => str.substr(str.length - 3, str.length)
  const withoutSuffix = (str) => str.substr(0, str.length - 3)

  inject('translate', (data, lang) => {

    const langSuffixes = ['_en', '_pt']
    const keys = Object.keys(data)
    const withoutTranslation = keys
      .filter(
        (key) => !langSuffixes.includes(suffix(key))
      )
    const withTranslation = [
      ... new Set(
        keys.filter(
          (key) => langSuffixes.includes(suffix(key))
        ).map(
          withoutSuffix
        )
      )
    ]

    const withoutTranslationObject =
      withoutTranslation.length ?
        Object.assign(
          ...withoutTranslation.map(
            (key) => ({ [key]: (isObject(data[key]) ? app.$translate(data[key], lang) : data[key]) })
          )
        ) : {}

    const withTranslationObject =
      withTranslation.length ?
        Object.assign(
          ...withTranslation.map(
            (key) => ({ [key]: data[`${key}_${lang}`] })
          )
        ) : {}

    return {
      ...withoutTranslationObject,
      ...withTranslationObject
    }

  })
}