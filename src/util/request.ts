// const baseUrl = 'http://localhost:9527'
// const baseUrl = 'https://cnodejs.org/api/v1'
const baseUrl = 'http://localhost:7001'

const headers = {
  'Authorization': 'ZXlKaGJHY2lPaUpJVXpJMU5pSjkuZXlKemRXSWlPaUp0ZVhwdmJtVWlMQ0p1WW1ZaU9qRTJNVFEyT0RBeE1qWXNJbkp2YkdWSlpDSTZJakVpTENKMWJuUnBiQ0k2TVRZeE5EWTROek15TmpNMk5Td2laWGh3SWpveE5qRTBOelkyTlRJMkxDSjFjMlZ5U1dRaU9pSXlJaXdpYVdGMElqb3hOakUwTmpnd01USTJMQ0pxZEdraU9pSTVPV1JtT0RZd1l5MHhZV1EyTFRSbVlUTXRZV1UwTmkwMU1tSXlOV1ZqWVdVM01qRWlmUS5GemRBUE41aWZSdTlrZmpUcnM0andqMnRZNkdjMlMzdGVWbnBGbW1UWjdZ'
}

interface Response {
  errno: number;
  data: any | undefined;
  errmsg: string;
}

function myFetch(uri: string, options?: RequestInit): Promise<Response> {
  return fetch(baseUrl + uri, {
    // headers,
    // body,
    // method,
    ...options,
    headers: {
      'content-type': 'application/json'
    },
    credentials: 'include'
  })
    .then(res => res.json())
}

export default (uri: string, options?: RequestInit): Promise<Response> => {
  return myFetch(uri, options)
    .then(result => {
      if (result.errno !== 0) {
        alert(result.errmsg)
        console.error(result.errmsg)
      }
      return result
    })
}