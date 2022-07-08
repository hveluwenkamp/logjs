'use-strict'

import Logger, { Styles, Processors } from '@hveluwenkamp/logjs'
import ExampleData from '@hveluwenkamp/logjs/examples/example.data'

const example1 = Logger()
const example2 = Logger('Function Label', { styles: Styles, processors: Processors })

example1.clear().whoami() // default name is 'logjs'

// simple test with no label
example1.p('Simple test message using defaults')
example1.type('log').p('Simple test message using defaults with console method "log"')
example1.type('warn').p('Simple test message using defaults with console method "warn"')
example1.type('error').p('Simple test message using defaults with console method "error"')

// test all styles for all methods types
const styles = Object.keys(Styles)
const methods = ['log', 'warn', 'error'] // useful console methods
styles.forEach(style => {
  methods.forEach(type => {
    example2.p(`Some text with style '${style}' and console method '${type}'`, { style, type })
  })
})

example2.set(ExampleData).out() // will be using dir method by default
example2.set(ExampleData).out('table')

example2.set(ExampleData)
  .limit(4)
  .process({
    lastName: 'upper',
    unixTime: 'ux,datetime',
    safeEmail: 'left,@',
    timezone: 'right,/',
    iso8601: 'date,toLocaleTimeString'
  })
  .out('table')

example2.set(ExampleData)
  .limit(2)
  .include(['lastName', 'timezone'])
  .process({
    timezone: 'left,/'
  })
  .process({
    timezone: 'upper'
  })
  .out('table')
