import { defineChain } from '@relevanceai/chain';

// the dataset created in this Google Colab: https://colab.research.google.com/drive/1XYaRamHmHop3GV4MGTMaDZjRZuWfMy9O?usp=sharing
const DATASET_ID = 'knowledge_base';
const DATASET_EMBEDDING_FIELD = 'embedding_vector_';

const chain = defineChain({
    title: 'PDF Q&A',
    publiclyTriggerable: true,
    params: {
        question: {
            type: 'string',
        },
        history: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                    },
                    role: {
                        type: 'string', // either 'user' or 'ai'
                    },
                },
            },
        },
  },
  setup({ params, step, code, runIf }) {
        // steps go here
        const { question, history } = params;

        // use an LLM to modify the question
        const { modifiedQuestion } = runIf(history, () => {
          // wrap our custom Javascript function in our code utility
          const { transformed: reducedHistory } = code({ history }, ({ history }) =>
              history.reduce(
                  (acc, item) =>
                      `${acc}\n${item.role === 'ai' ? 'ASSISTANT' : 'USER'}: ${
                          item.message
                      }\n`,
                  ''
              )
          );

          const { answer: modifiedQuestion } = step('prompt_completion', {
            prompt: `The human is having a conversation with an assistant, where the assistant will query a knowledgebase to get the context needed to provide an answer. You must use the chat history and the follow-up input to rephrase the question such that it can be used on its own. This means the standalone question must be include context from the chat history necessary to provide an answer.

For example, if the chat history contains information about the temperature and the user asks to convert it into another unit - provide that in the standalone question. Or if the user asks a question about a subject from the history, reference that subject with detail.

Chat History: ${reducedHistory}

Follow Up Input: ${question}.

Standalone question:`,
          });

          return { modifiedQuestion };
        });

        const { transformed: questionTransform } = code({ history, modifiedQuestion, question }, ({ history, modifiedQuestion, question }) => {
          return {
            question: history && history.length ? modifiedQuestion : question as string
          };
        });
    
        const questionToUse = questionTransform.question;

        // Step 2. search vector database for relevant text chunks
        const { results: vectorSearchResults } = step('search', {
            query: questionToUse,
            dataset_id: DATASET_ID,
            vector_field: DATASET_EMBEDDING_FIELD,
            model: 'text-embedding-ada-002',
            page_size: 3,
        });
    
    const { transformed: searchTransformed } = code({ vectorSearchResults }, ({ vectorSearchResults }) => {
      return {
        results: vectorSearchResults.map((result: Record<string, any>) => ({
          text: result.text,
          url: result.pdf_url
        }))
      }
    });

    const resultsMapped = searchTransformed.results;

        // Step 3. ask LLM, injecting vector database results as context
        const { answer } = step('prompt_completion', {
          prompt: `Use the following pieces of context to answer the question at the end in JSON. If you don't know the answer, just say that you don't know, don't try to make up an answer. Provide a reference to the "pdf_url" of the items used to give the answer. The response must be JSON using the format "{ answer, references: [url] }".

${resultsMapped}

Question: ${questionToUse}

Helpful Answer JSON:`
        });

        // finally, let's convert the answer to JSON
        const { transformed: answerJSON } = code(({ answer }), ({ answer }) => {
          let returnAnswer = { answer: "I couldn't answer the question. Please try again.", references: [] };

            try {
              // try to convert the LLM's answer into JSON
              returnAnswer = JSON.parse(answer);
            } catch (err) {}

            return returnAnswer;
        });

        return {
          answer: answerJSON
        }
    },
});

export default chain;