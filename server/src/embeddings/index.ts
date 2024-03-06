import getOpenAiEmbeddings from "./openai";
import getVertexEmbeddings from "./googleVertex";
import getServerlessEndpointEmbeddings from "./serverlessEndpoints";

const EMBEDDING_SOURCE = process.env.EMBEDDING_SOURCE || "openai";

async function getTermEmbeddings(query) {
  switch (EMBEDDING_SOURCE) {
    case "openai":
      return await getOpenAiEmbeddings(query);
    case "googleVertex":
      return await getVertexEmbeddings(query);
    case "serverlessEndpoint":
      return await getServerlessEndpointEmbeddings(query);
    default:
      return await getOpenAiEmbeddings(query);
  }
}

export default getTermEmbeddings;
