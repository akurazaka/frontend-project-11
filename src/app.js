import * as yup from 'yup';
import i18next from 'i18next';
import { nanoid } from 'nanoid';
import watcher from './view.js';
import resources from './locales/index.js';
import parser from './toParse.js';
import proxyAPI from './proxyAPI.js';

const validateURL = (url, feeds) => {
  const feedUrls = feeds.map((feed) => feed.url);
  const schema = yup.string()
    .url('errors.notValid')
    .required('errors.emptyField')
    .notOneOf(feedUrls, 'errors.hasAlready');

  return schema.validate(url)
    .then(() => {})
    .catch((error) => error.message);
};

const appState = {
  form: {
    status: 'no data',
    error: null,
  },
  loadingProcess: {
    status: 'no data',
    error: null,
  },
  feeds: [],
  posts: [],
  modal: {
    readPostsId: new Set(),
    viewedId: null,
  },
};

const fetchContent = (url, watchedState) => {
  const isFeedExists = watchedState.feeds.some((feed) => feed.url === url);
  if (isFeedExists) {
    const updatedForm = { ...watchedState.form, error: 'errors.hasAlready', status: 'failed' };
    watchedState.form = updatedForm;
    return;
  }

  proxyAPI(url)
    .then((data) => {
      const { feed, posts } = parser(data);
      const feedId = nanoid();
      const enrichedPosts = posts.map((post) => ({ id: nanoid(), feedId, ...post }));
      watchedState.feeds = [{ id: feedId, url, ...feed }, ...watchedState.feeds];
      watchedState.posts = [...enrichedPosts, ...watchedState.posts];
      watchedState.loadingProcess = { ...watchedState.loadingProcess, status: 'success' };
    })
    .catch((error) => {
      watchedState.loadingProcess = { ...watchedState.loadingProcess, error: error.message, status: 'failed' };
      console.error(error);
    });
};

const monitorNewContent = (watchedState) => {
  const { feeds, posts } = watchedState;
  const checkInterval = 5000;

  const promises = feeds.map((feed) => proxyAPI(feed.url)
    .then((data) => {
      const { posts: newPosts } = parser(data);
      const existingLinks = posts.map((post) => post.link);

      const feedId = feed.id;
      const uniqueNewPosts = newPosts.filter((post) => !existingLinks.includes(post.link));

      if (uniqueNewPosts.length > 0) {
        const newPostsWithId = uniqueNewPosts.map((post) => ({ id: nanoid(), feedId, ...post }));
        watchedState.posts.unshift(...newPostsWithId);
      }
    })
    .catch((error) => console.error(error)));

  Promise.all(promises).then(() => {
    setTimeout(() => monitorNewContent(watchedState), checkInterval);
  });
};

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    button: document.querySelector('[aria-label="add"]'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    modalWindow: document.querySelector('.modal'),
  };

  const i18nextInstance = i18next.createInstance();

  i18nextInstance
    .init({
      debug: false,
      lng: 'ru',
      resources,
    })
    .then(() => {
      const watchedState = watcher(appState, elements, i18nextInstance);

      elements.form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const url = formData.get('url').trim();
        const { feeds } = appState;

        validateURL(url, feeds).then((error) => {
          if (error) {
            watchedState.form.error = error;
            watchedState.form.status = 'failed';
          } else {
            watchedState.form.error = '';
            watchedState.form.status = 'loading';
            watchedState.loadingProcess.status = '';
            fetchContent(url, watchedState);
          }
        });
      });

      elements.postsContainer.addEventListener('click', (event) => {
        const { id } = event.target.dataset;
        if (id) {
          watchedState.modal.readPostsId.add(id);
          watchedState.modal.viewedId = id;
        }
      });

      monitorNewContent(watchedState);
    });
};
