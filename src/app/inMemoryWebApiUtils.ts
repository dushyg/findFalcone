import { RequestInfo, ResponseOptions } from 'angular-in-memory-web-api';

export function createResponse(reqInfo: RequestInfo, data: any) {
  // console.log('trying to return find falcone response from in memory web api');
  return reqInfo.utils.createResponse$(() => {
    // console.log('HTTP POST override');

    const options: ResponseOptions = {
      body: data,
      status: 200,
      statusText: 'OK',
      url: reqInfo.url,
      headers: reqInfo.headers,
    };
    return options;
  });
}
