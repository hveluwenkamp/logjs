'use-strict'

import Logger, { Styles, Processors } from '@hveluwenkamp/logjs'
import ExampleData from './example.data.js'

const test1 = Logger()
const test2 = Logger('Function Label', { styles: Styles, processors: Processors })

// simple test with no label
test1.p('Simple test message using defaults')
test1.type('warn').p('Simple test message using defaults with type "info"')
test1.type('error').p('Simple test message using defaults with type "error"')

// test all styles for all types including label
const styles = Object.keys(Styles)
const types = ['log', 'warn', 'error'] // allowed console methods
styles.forEach(style => {
    types.forEach(type => {
        test2.p(`Some text with style '${style}' and type '${type}'`, { style, type })
    })
})

// test output of data array
test2.set(ExampleData).out('table')

test2.set(ExampleData)
    .limit(4)
    .process({
        lastName: 'upper',
        unixTime: 'ux,datetime',
        safeEmail: 'left,@',
        timezone: 'right,/',
        iso8601: 'date,toLocaleTimeString'
    })
    .out('table')
