import axios from 'axios';

const createProxiedUrl = (originalUrl) => {
  const proxyBaseUrl = 'https://allorigins.hexlet.app/get';
  const urlParams = new URLSearchParams({
    disableCache: 'true',
    url: originalUrl,
  });

  return `${proxyBaseUrl}?${urlParams.toString()}`;
};


export default (originalUrl) => {
  return axios
    .get(createProxiedUrl(originalUrl))
    .then((response) => {
      if (response.status >= 200 && response.status < 400) {
        return response.data.contents;
      }
      throw new Error('errors.unknown');
    })
    .catch((error) => {
      error.message = 'errors.network';
      throw error;
    });
};
