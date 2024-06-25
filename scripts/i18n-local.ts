import { consola } from 'consola';
import 'dotenv/config';
import { ChatOllama } from 'langchain/chat_models/ollama';
import { HumanMessage, SystemMessage } from 'langchain/schema';

import { config } from './const';

const model = new ChatOllama({
  baseUrl: "http://127.0.0.1:11434",
  model: "llama3",
  format: "json",
});

export const translateJSON = async (json, outputLocale, entryLocale = config.entryLocale) => {
  consola.info(`i18n generating...`);
  const res = await model.call(
    [
      new SystemMessage(
        [
          `Translate the i18n JSON file from ${entryLocale} to ${outputLocale} according to the BCP 47 standard`,
          `Keep the keys the same as the original file and make sure the output remains a valid i18n JSON file.`,
        ].join('\n'),
      ),
      new HumanMessage(JSON.stringify(json)),
    ],
    {
      response_format: { type: 'json_object' },
    },
  );

  return JSON.parse(res.content);
};
