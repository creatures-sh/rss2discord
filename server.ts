import fastify from 'fastify';
import { getList, postSubscribe, putDefaultChannel } from './routes';

const server = fastify();

server.put('/default-channel', putDefaultChannel);
server.post('/subscribe', postSubscribe);
server.get('/list', getList);

const port = parseInt(process.env.PORT || '') || 8080;
const host = process.env.HOST || 'localhost';

server.listen({ port, host }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

export default server;
