import Fastify from 'fastify';
import cors from '@fastify/cors';
import items from 'data/items.json' with { type: 'json' };
import { Item } from 'src/types.ts';
import { ItemsGetInQuerySchema, ItemUpdateInSchema } from 'src/validation.ts';
import { treeifyError, ZodError } from 'zod';
import { doesItemNeedRevision } from './src/utils.ts';
import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '.env') });

const ITEMS = items as Item[];

const fastify = Fastify({
  logger: true,
});

await fastify.register(cors, {
  origin: '*', 
  methods: ['GET', 'PUT', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

interface ItemGetRequest extends Fastify.RequestGenericInterface {
  Params: { id: string };
}

fastify.get<ItemGetRequest>('/items/:id', (request, reply) => {
  const itemId = Number(request.params.id);
  if (!Number.isFinite(itemId)) {
    reply.status(400).send({ success: false, error: 'Item ID path param should be a number' });
    return;
  }
  const item = ITEMS.find(item => item.id === itemId);
  if (!item) {
    reply.status(404).send({ success: false, error: "Item with requested id doesn't exist" });
    return;
  }
  return {
    ...item,
    needsRevision: doesItemNeedRevision(item),
  };
});

interface ItemsGetRequest extends Fastify.RequestGenericInterface {
  Querystring: {
    q?: string;
    limit?: string;
    skip?: string;
    categories?: string;
    needsRevision?: string;
    sortColumn?: string;
    sortDirection?: string;
  };
}

fastify.get<ItemsGetRequest>('/items', request => {
  const {
    q,
    limit,
    skip,
    needsRevision,
    categories,
    sortColumn,
    sortDirection,
  } = ItemsGetInQuerySchema.parse(request.query);

  const filteredItems = ITEMS.filter(item => {
    return (
      item.title.toLowerCase().includes(q.toLowerCase()) &&
      (!needsRevision || doesItemNeedRevision(item)) &&
      (!categories?.length || categories.some(category => item.category === category))
    );
  });

  return {
    items: filteredItems
      .toSorted((item1, item2) => {
        let comparisonValue = 0;
        if (!sortDirection) return comparisonValue;
        if (sortColumn === 'title') {
          comparisonValue = item1.title.localeCompare(item2.title);
        } else if (sortColumn === 'createdAt') {
          comparisonValue = new Date(item1.createdAt).valueOf() - new Date(item2.createdAt).valueOf();
        }
        return (sortDirection === 'desc' ? -1 : 1) * comparisonValue;
      })
      .slice(skip, skip + limit)
      .map(item => ({
        id: item.id,
        category: item.category,
        title: item.title,
        price: item.price,
        needsRevision: doesItemNeedRevision(item),
      })),
    total: filteredItems.length,
  };
});

interface ItemUpdateRequest extends Fastify.RequestGenericInterface {
  Params: { id: string };
}

fastify.put<ItemUpdateRequest>('/items/:id', (request, reply) => {
  const itemId = Number(request.params.id);
  if (!Number.isFinite(itemId)) {
    reply.status(400).send({ success: false, error: 'Item ID path param should be a number' });
    return;
  }
  const itemIndex = ITEMS.findIndex(item => item.id === itemId);
  if (itemIndex === -1) {
    reply.status(404).send({ success: false, error: "Item with requested id doesn't exist" });
    return;
  }
  try {
    const parsedData = ItemUpdateInSchema.parse({
      category: ITEMS[itemIndex].category,
      ...(request.body as {}),
    });
    ITEMS[itemIndex] = {
      id: ITEMS[itemIndex].id,
      createdAt: ITEMS[itemIndex].createdAt,
      updatedAt: new Date().toISOString(),
      ...parsedData,
    };
    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      reply.status(400).send({ success: false, error: treeifyError(error) });
      return;
    }
    throw error;
  }
});

fastify.post('/ai/description', async (request, reply) => {
  const { title, category, params, currentDescription } = request.body as any;
  const prompt = `Ты — AI-ассистент, помогающий улучшить описание товара на площадке объявлений. 
На основе предоставленной информации напиши улучшенное, подробное, привлекательное описание. 
Используй маркированные списки для преимуществ, добавляй эмодзи. 
Не используй шаблонные фразы, пиши уникально. 

Информация о товаре:
Категория: ${category}
Название: ${title}
Характеристики: ${JSON.stringify(params, null, 2)}
Текущее описание: ${currentDescription || 'отсутствует'}

Напиши улучшенное описание (не более 300 слов):`;

  try {
    const response = await axios.post(
      'https://ai.api.cloud.yandex.net/v1/chat/completions',
      {
        model: `gpt://${process.env.YANDEX_FOLDER_ID}/aliceai-llm`,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Api-Key ${process.env.YANDEX_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const text = response.data.choices[0].message.content;
    return { description: text };
  } catch (error: any) {
    fastify.log.error(error);
    reply.status(500).send({ error: 'Failed to generate description', details: error.message });
  }
});

fastify.post('/ai/price', async (request, reply) => {
  const { title, category, params, currentPrice } = request.body as any;
  const prompt = `Ты — AI-аналитик. На основе данных объявления предложи три варианта рыночной цены. 
Ответ должен быть в формате:
- Диапазон от X до Y ₽ (отличное состояние)
- Средняя цена Z ₽ (идеал, малый износ)
- Диапазон от A до B ₽ (срочно или с дефектами)

Информация:
Категория: ${category}
Название: ${title}
Характеристики: ${JSON.stringify(params, null, 2)}
Текущая цена: ${currentPrice} ₽

Только диапазоны и описания, без лишнего текста.`;

  try {
    const response = await axios.post(
      'https://ai.api.cloud.yandex.net/v1/chat/completions',
      {
        model: `gpt://${process.env.YANDEX_FOLDER_ID}/aliceai-llm`,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Api-Key ${process.env.YANDEX_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const text = response.data.choices[0].message.content;
    const lines = text.split('\n').filter(l => l.trim());
    const details: string[] = [];
    for (const line of lines) {
      if (line.includes('₽')) {
        details.push(line.trim());
      }
    }
    if (details.length === 0) {
      const current = currentPrice || 10000;
      const min = Math.round(current * 0.8);
      const max = Math.round(current * 1.2);
      const avg = Math.round((min + max) / 2);
      details.push(`${min} - ${max} ₽ (отличное состояние)`);
      details.push(`${avg} ₽ (идеал, малый износ)`);
      details.push(`${Math.round(min * 0.9)} - ${Math.round(avg * 0.9)} ₽ (срочно или с дефектами)`);
    }
    return { details };
  } catch (error: any) {
    fastify.log.error(error);
    reply.status(500).send({ error: 'Failed to get price recommendations', details: error.message });
  }
});

const port = process.env.PORT ? Number(process.env.PORT) : 8080;
fastify.listen({ port }, function (err, _address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.debug(`Server is listening on port ${port}`);
});