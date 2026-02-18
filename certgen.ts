import fs from 'fs'
import { exec } from 'child_process'

// chjck if we're on windows
const isWindows = process.platform === 'win32'

// adjust the openssl keygen command based on platform
const cmd = isWindows
  ? 'mkdir certs && cd .\\certs\\ && openssl req -x509 -newkey rsa:4096 -keyout aircards.key -out aircards.crt -days 365 -nodes -subj "/CN=localhost"'
  : 'mkdir -p certs && cd ./certs && openssl req  -x509 -newkey rsa:4096 -keyout aircards.key -out aircards.crt -days 365 -nodes -subj "/CN=localhost"'

// export a function that returns a promise that resolves an object containing the ssl key and cert
export default (keyUrl: string, certUrl: string): Promise<{devServerKey: string; devServerCert: string}> =>
  new Promise((resolve, reject) => {
    let devServerKey: string, devServerCert: string

    // check if the ssl key and cert already exist in a certs dir at project root
    const localCertExists = fs.existsSync(
      new URL(keyUrl, import.meta.url)) &&
    fs.existsSync(new URL(certUrl, import.meta.url)
    )
    if (localCertExists) {
      // if certs exist, use them for local ssl
      console.log('Loading ssl certs from certs dir at project root...')
      devServerKey = new URL('./certs/aircards.key', import.meta.url).pathname
      devServerCert = new URL('./certs/aircards.crt', import.meta.url).pathname
      if (isWindows) {
        devServerKey = '/' + devServerKey.replace(/[A-Z]:/g, '').replace(/^\/+/, '')
        devServerCert = '/' + devServerCert.replace(/[A-Z]:/g, '').replace(/^\/+/, '')
      }
      return resolve({ devServerKey, devServerCert })
    } else {
      // otherwise generate them in a certs dir at project root
      console.log('Could not find ssl certs, generating them in certs dir at project root...')
      exec(cmd, (err) => {
        if (err) {
          console.error(err)
          return reject(err)
        }
        devServerKey = new URL('./certs/aircards.key', import.meta.url).pathname
        devServerCert = new URL('./certs/aircards.crt', import.meta.url).pathname
        if (isWindows) {
          devServerKey = '/' + devServerKey.replace(/[A-Z]:/g, '').replace(/^\/+/, '')
          devServerCert = '/' + devServerCert.replace(/[A-Z]:/g, '').replace(/^\/+/, '')
        }
        return resolve({ devServerKey, devServerCert })
      })
    }
  })
