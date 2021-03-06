#!/usr/bin/env node

'use strict'

const chalk = require('chalk')
const meow = require('meow')
const WebSSL = require('./openssl')

// prettier-ignore
const cli = meow(
  `
  ${chalk.blue('Usage')}
    $ webssl [flags] <out_dir>

  ${chalk.blue('Arguments')}
    <out_dir>   Where to save all files          (default: ${chalk.yellow('/Current/Folder')})*

    Path can be absolute (starting with a slash) or relative. Relative path
    will be resolved with the folder you are executing this script from.

  ${chalk.blue('Options')}
    --filename, -f        The name of the file which gets generated   (default: ${chalk.yellow('ssl')})
    --addToKeychain, -a   Add your generated key file to Keychain     (default: ${chalk.yellow('false')})
    --removeOld, -r       Remove your old key from Keychain           (default: ${chalk.yellow('false')})
    --keychain, -k        Select a keychain                           (default: ${chalk.yellow('login')})
    --config, -c          Path to config file or false to disable     (default: ${chalk.yellow('./')})
    --dns                 DNS entries split by a comma.               (default: ${chalk.yellow('null')})

    --commonName, -CN            OpenSSL \`commonName\` subject entry${chalk.red('*')}
    --countryName, -C            OpenSSL \`countryName\` subject entry${chalk.red('*')}
    --stateOrProvinceName, -ST   OpenSSL \`stateOrProvinceName\` subject entry${chalk.red('*')}
    --localityName, -L           OpenSSL \`localityName\` subject entry${chalk.red('*')}
    --organizationName, -O       OpenSSL \`organizationName\` subject entry${chalk.red('*')}
    --organizationalUnit, -OU    OpenSSL \`organizationalUnit\` subject entry
    --emailAddress               OpenSSL \`emailAddress\` subject entry

  ${chalk.blue('Examples')}
    $ webssl \\
        --addToKeychain \\
        --keychain development \\
        --dns some.net,test.de \\
        --commonName Test \\
        /Users/Hi/Downloads

  ${chalk.red('*')} this is required unless you do not have it in a config file
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
        alias: 'c',
      },
      dns: {
        type: 'string',
      },
      addToKeychain: {
        type: 'boolean',
        alias: 'a',
        default: false
      },
      removeOld: {
        type: 'boolean',
        alias: 'r',
        default: false
      },
      keychain: {
        type: 'string',
        alias: 'k',
        default: 'login'
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
  removeOld,
  keychain,
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
  removeOld,
  keychain,
  config,
  dns,
  openssl: {
    commonName,
    countryName,
    stateOrProvinceName,
    localityName,
    organizationName,
    organizationalUnit,
    emailAddress,
  },
}

options.outDir = cli.input[0] || process.cwd()

const webssl = new WebSSL(options)
webssl.generate()
