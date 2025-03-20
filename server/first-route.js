async function routes(fastify, options) {
  const collection = fastify.mongo.db.collection('users');

  fastify.get('/', async (request, reply) => {
    return { hello: 'world' };
  });

  fastify.get('/users', async (request, reply) => {
    const result = await collection.find().toArray();
    if (result.length === 0) {
      throw new Error('No documents found');
    }
    return result;
  });

  fastify.get('/users/:id', async (request, reply) => {
    const result = await collection.findOne({ _id: request.params.id });
    if (!result) {
      throw new Error('Invalid value');
    }
    return result;
  });

  const usersBodyJsonSchema = {
    type: 'object',
    required: ['user'],
    properties: {
      name: { type: 'string' },
      age: { type: 'integer' },
    },
  };

  const schema = {
    body: usersBodyJsonSchema,
  };

  fastify.post('/users', { schema }, async (request, reply) => {
    // we can use the `request.body` object to get the data sent by the client
    const result = await collection.insertOne({ user: request.body.user });
    return result;
  });
}

export default routes;
