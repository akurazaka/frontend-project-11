import axios from 'axios';

const createProxiedUrl = (originalUrl) => {
  const proxyBaseUrl = 'https://allorigins.hexlet.app/get';
  const urlParams = new URLSearchParams({
    disableCache: 'true',
    url: originalUrl,
  });

  return `${proxyBaseUrl}?${urlParams.toString()}`;
};

const proxyAPI = (originalUrl) => {
  return axios
    .get(createProxiedUrl(originalUrl))
    .then((response) => (
      response.status >= 200 && response.status < 400
        ? response.data.contents
        : Promise.reject(new Error('errors.unknown'))
    ))
    .catch((error) => {
      const networkError = new Error('errors.network');
      networkError.stack = error.stack;
      throw networkError;
    });
};

export default proxyAPI;
