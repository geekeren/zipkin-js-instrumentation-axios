import { Instrumentation } from 'zipkin';
const reject = error => Promise.reject(error);

const zipkinRecordRequest = (config, options) => {
  const instrumentation = new Instrumentation.HttpClient(options);
  return instrumentation.recordRequest(config, config.url, config.method);
};

const zipkinRecordResponse = (res, options) => {
  const instrumentation = new Instrumentation.HttpClient(options);
  instrumentation.recordResponse(options.tracer.id, res.status);
  return res;
};
const wrapAxios = (axios, options = {}) => {
  axios.interceptors.request.use(config => zipkinRecordRequest(config, options), reject);
  axios.interceptors.response.use(res => zipkinRecordResponse(res, options), reject);
  return axios;
};
export default wrapAxios;
