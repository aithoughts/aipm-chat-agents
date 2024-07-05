import { consola } from "consola";
import "dotenv/config";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";

import { config } from "./const";

const model = new ChatOpenAI(
  { temperature: 0, modelName: config.modelName },
  { baseURL: process.env.OPENAI_PROXY_URL },
);

export const translateJSON = async (
  json,
  outputLocale,
  entryLocale = config.entryLocale,
) => {
  consola.info(`i18n generating...`);
  console.log(`i18n generating...`);
  const res = await model.invoke(
    [
      new SystemMessage(
        [
          `Translate the i18n JSON file from ${entryLocale} to ${outputLocale} according to the BCP 47 standard`,
          `Delete all data except the JSON, removing "\`\`\`" and "json" strings as well.`,
          `Keep the keys the same as the original file and make sure the output remains a valid i18n JSON file.`,
        ].join("\n"),
      ),
      new HumanMessage(JSON.stringify(json)),
    ],
    {
      response_format: { type: "json_object" },
    },
  );
  console.log(res);

  return JSON.parse(res.content);
};
