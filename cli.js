#!/usr/bin/env node

'use strict'

const chalk = require('chalk')
const meow = require('meow')
const OpenSSL = require('./openssl')

// prettier-ignore
const cli = meow(
  `
  ${chalk.blue('Usage')}
    $ owd <destination> <...dns> [flags]

  ${chalk.blue('Arguments')}
    <destination>  Where to save everything  (default: ${chalk.yellow('./')})

  ${chalk.blue('Options')}
    --filename, -f        The name of the file which gets generated   (default: ${chalk.yellow('ssl')})
    --addToKeychain, -k   Add your generated key file to Keychain     (default: ${chalk.yellow('false')})
    --config              Path to config file or false to disable     (default: ${chalk.yellow('.')})
    --dns                 DNS entries split by comma(!).              (default: ${chalk.yellow('null')})

    --commonName, -CN             OpenSSL \`commonName\` subject entry${chalk.red('*')}
    --countryName, -C             OpenSSL \`countryName\` subject entry${chalk.red('*')}
    --stateOrProvinceName, -ST    OpenSSL \`stateOrProvinceName\` subject entry${chalk.red('*')}
    --localityName, -L            OpenSSL \`localityName\` subject entry${chalk.red('*')}
    --organizationName, -O        OpenSSL \`localityName\` subject entry${chalk.red('*')}
    --organizationalUnit, -OU     OpenSSL \`localityName\` subject entry
    --emailAddress                OpenSSL \`emailAddress\` subject entry

  ${chalk.blue('Examples')}
    $ owd /Users/Hi/Downloads \\
        --dns some.net,test.de \\
        --commonName Test

  ${chalk.red('*')} this is required
`,
  {
    flags: {
      filename: {
        type: 'string',
        default: "ssl",
        alias: 'f',
      },
      config: {
        type: 'string',
      },
      dns: {
        type: 'string',
      },
      addToKeychain: {
        type: 'boolean',
        alias: 'k',
        default: false
      },
      commonName: {
        type: 'string',
        alias: 'CN',
      },
      countryName: {
        type: 'string',
        alias: 'C',
      },
      stateOrProvinceName: {
        type: 'string',
        alias: 'ST',
      },
      localityName: {
        type: 'string',
        alias: 'L',
      },
      organizationName: {
        type: 'string',
        alias: 'O',
      },
      organizationalUnit: {
        type: 'string',
        alias: 'OU',
      },
      emailAddress: {
        type: 'string',
      },
    },
  }
)

const {
  filename,
  addToKeychain,
  commonName,
  countryName,
  stateOrProvinceName,
  localityName,
  organizationName,
  organizationalUnit,
  emailAddress,
} = cli.flags

const dns = cli.flags.dns ? cli.flags.dns.split(',') : undefined
const config = cli.flags.config === 'false' ? false : cli.flags.config

const options = {
  filename,
  addToKeychain,
  config,
  dns,
  commonName,
  countryName,
  stateOrProvinceName,
  localityName,
  organizationName,
  organizationalUnit,
  emailAddress,
}

options.destination = cli.input[0] || process.cwd()

new OpenSSL(options)