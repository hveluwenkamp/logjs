'use-strict'

const LogJS = function (label = '', params = {}) {
  const config = {
    label,
    style: 'default',
    styles: { default: { label: '', message: '' } },
    type: 'log',
    get: 'raw',
    ...params // override defaults from params
  }

  let data = [] // contains the source data to be processed

  /* General utlity methods */

  const clear = function () {
    console.clear()
    const label = config.label ? config.label : 'logjs'
    console.log("CLEARED by '" + label + "'")
    return this
  }

  const whoami = function () {
    const label = config.label ? config.label : 'logjs'
    console.log("THIS is '" + label + "'")
    return this
  }

  /* Simple logging methods */

  // pretty print to the console with ability to override default style and type
  const p = function (input, params = { style: config.style, type: config.type }) {
    const { style, type } = params

    const [styleLabel, styleMessage] = config.styles[style]
      ? [config.styles[style].label, config.styles[style].message]
      : ['', '']

    const message = (typeof input === 'object' && type === 'log')
      ? JSON.stringify(input)
      : input

    const out = (label === '')
      ? ['%c' + message, styleMessage]
      : ['%c' + config.label + '%c' + message, styleLabel, styleMessage]

    console[type](...out)
    return this
  }

  // set the default style to be used from config.styles object
  const style = function (style = config.style) {
    config.style = style
    return this
  }

  // set the default type to be used for console output
  const type = function (type = config.type) {
    config.type = type
    return this
  }

  /* Data array methods */

  // Populate data with input array
  const set = function (input) {
    if (!Array.isArray(input)) return
    data = input.slice()
    return this
  }

  const include = function (list) {
    if (data.length === 0) return this

    // only include fields with names specified in the list array
    data = data.map((row) => (
      Object.entries(row).filter(([key]) => list.includes(key))
      // convert back to object
        .reduce(_reducerArray, {})
    ))
    return this
  }

  const exclude = function (list) {
    // only include fields with names specified in the list array
    data = data.map((row) => (
      Object.entries(row).filter(([key]) => !list.includes(key))
      // convert back to object
        .reduce(_reducerArray, {})
    ))
    return this
  }

  // limit the rows to be output by mutating data
  const limit = function (params) {
    if (Array.isArray(params)) {
      data = data.slice(params[0], params[0] + params[1])
    } else if (typeof params === 'number') {
      data = data.slice(0, params)
    }
    return this
  }

  const get = function (get = config.get) {
    const functionGet = {
      string: (data) => JSON.stringify(data, null, 2),
      raw: (data) => data
    }
    const lookupGet = ['string'].includes(get) ? get : 'raw'
    return functionGet[lookupGet](data)
  }

  /*
  * Iterate over fields defined in params and process them with the named processor.
  */
  const process = function (namesFieldsToProcess) {
    if (data.length === 0) return this

    const keysProcessor = Object.keys(config.processors) // processor keys
    const keysToProcess = Object.keys(namesFieldsToProcess) // which fields to process
    const namesAllFields = Object.keys(data[0]) // all field names

    const processorIdentity = { fn: (value) => value, options: null }

    // find processor functions by row
    const processors = namesAllFields
      .map((nameField) => {
        let processor

        // set default processor to identity and options to null
        if (keysToProcess.includes(nameField)) {
          let keyProcessor = namesFieldsToProcess[nameField]
          let keyOptions = null

          if (keyProcessor.includes(',')) {
            [keyProcessor, keyOptions] = keyProcessor.split(',')
          }

          if (keysProcessor.includes(keyProcessor)) {
            processor = {
              fn: config.processors[keyProcessor],
              options: keyOptions
            }
          } else {
            // cannot find processor
            processor = processorIdentity
          }

          return { [nameField]: processor }
        } else {
          // no processor specified
          return { [nameField]: processorIdentity }
        }
      })
      .reduce(_reducerObject, {}) // convert to object with names as keys

    // apply processor to each row of data
    data = data.map((row) =>
      namesAllFields
        .map((nameField) => ({
          [nameField]: processors[nameField].fn(
            row[nameField],
            processors[nameField].options
          )
        }))
        .reduce(_reducerObject, {}) // convert to object with names as keys
    )

    return this
  }

  // output data to console using standard console methods
  const out = function (type = config.out) {
    if (data.length === 0) return null

    const functionOutput = {
      dir: (data) => console.dir(data),
      json: (data) => console.log(JSON.stringify(data, null, 2)),
      table: (data) => console.table(data),
      log: (data) => console.log(data)
    }
    const lookupType = ['dir', 'json', 'table', 'log'].includes(type) ? type : 'log'
    functionOutput[lookupType](data)

    return this
  }

  return { clear, whoami, p, type, style, set, get, out, include, exclude, limit, process }
}

// Reducer function to convert object
const _reducerObject = (accumulator, current) => {
  const key = Object.keys(current)[0]
  const val = Object.values(current)[0]
  return { ...accumulator, [key]: val }
}

// Reducer function to convert array
const _reducerArray = (accumulator, current) => ({ ...accumulator, [current[0]]: current[1] })

export default LogJS

export const Styles = {
  default: {
    label: 'font-weight: bold; color: #000; padding: 0 4px 0 0;)',
    message: "color: #000; padding: 0 0 0 4px;')"
  },
  fatal: {
    label: 'background: rgba(0, 0, 0, 1); color: #fff; padding: 4px;)',
    message: "background: rgba(0, 0, 0, 0.1); color: #000; padding: 4px;')"
  },
  alert: {
    label: 'background: rgba(255, 136, 0, 1); color: #fff; padding: 4px;)',
    message: "background:rgba(255, 136, 0, 0.2); color: #000; padding: 4px;')"
  },
  info: {
    label: "background: rgba(0, 136, 255, 1); color: #fff; padding:4px;')",
    message: "background: rgba(0, 136, 255, 0.2); color: #000; padding:4px;')"
  }

}

const UxDateSlice = {
  datetime: [0, 21],
  time: [16, 21],
  day: [0, 15],
  date: [4, 15],
  dow: [0, 3]
}

export const Processors = {
  lower: (value) => value.toLowerCase(),
  upper: (value) => value.toUpperCase(),
  left: (value, option) => value.split(option).shift(),
  right: (value, option) => value.split(option).pop(),
  json: (value) => JSON.stringify(value),
  date: (value, option) => (value ? new Date(value)[option]() : null),
  ux: (value, option) =>
    value
      ? new Date(value < 10000000000 ? value * 1000 : value)
        .toString()
        .slice(...UxDateSlice[option])
      : null
}
