const baseUrl = 'http://localhost:7001';
// const baseUrl = 'http://192.168.1.105:7001'
// const baseUrl = 'http://10.154.0.38:7001';
// const baseUrl = '/api';

interface Response {
  errno: number;
  data: any | undefined;
  errmsg: string;
}

export default (
  uri: string,
  options?: RequestInit,
  isFile: boolean = false,
): Promise<Response> => {
  return fetch(baseUrl + uri, {
    // headers,
    // body,
    // method,
    ...options,
    headers: isFile
      ? undefined
      : {
          'content-type': 'application/json',
        },
    credentials: 'include',
  })
    .then(
      (result) => result.json(),
      (err) => {
        console.error(err);
        const errResponse: Response = {
          errno: -1,
          data: undefined,
          errmsg: '与服务器连接失败',
        };
        return errResponse;
      },
    )
    .then((result) => {
      if (result.errno !== 0) {
        console.error(result.errmsg);
      }
      return result;
    });
};
