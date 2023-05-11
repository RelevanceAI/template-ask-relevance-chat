import { CHAIN_ANSWER_OUTPUT_KEY, CHAIN_HISTORY_PARAM_KEY, CHAIN_PROJECT, CHAIN_QUESTION_PARAM_KEY, CHAIN_URL } from "~/relevance-config";

export const useChain = () => {
    const error = ref<string | null>(null);
    const isLoadingMessage = ref<boolean>(false);

    interface ChainApiPayload {
        project: string;
        params: Record<string, any>;
        version?: string;
    }

    interface ChainApiResponse {
        status: 'complete' | 'failed';
        errors: Record<'body', string>[];
        output: Record<string, any>;
        executionTime: number;
    }
    
    /** This is how our chain expects history, you are able to edit this in the chain */
    interface RelevanceHistoryObject {
        role: 'user' | 'ai';
        message: string;
        references?: string[];
    };

    const question = ref<string>('');
  
    /** Chat history to send to API */
    const chatHistory = ref<RelevanceHistoryObject[]>([]);
    
    /** This is what will render in our v-for loop - allows us to create optimistic UI*/
    const uiChatHistory = ref<RelevanceHistoryObject[]>([]);

    function clearHistory() {
        chatHistory.value = [];
        uiChatHistory.value = [];
    }

    async function askQuestion() {
        try {
            error.value = null;
            isLoadingMessage.value = true;

            // clear question from UI
            const clonedUserInput = question.value;
            question.value = '';

            uiChatHistory.value.push({
                role: 'user',
                message: clonedUserInput
            });

            const payload: ChainApiPayload = {
                // do not pass empty history array
                params: { [CHAIN_QUESTION_PARAM_KEY]: clonedUserInput, [CHAIN_HISTORY_PARAM_KEY]: chatHistory.value?.length ? chatHistory.value : undefined },
                project: CHAIN_PROJECT,
            };

            const response: ChainApiResponse = await $fetch(CHAIN_URL, {
                method: 'POST',
                body: payload,
            });

            const responseAnswer = response.output[CHAIN_ANSWER_OUTPUT_KEY];
             
            chatHistory.value.push({
                role: 'user',
                message: clonedUserInput
            });

            chatHistory.value.push({
                role: 'ai',
                message: responseAnswer.answer,
            });

            uiChatHistory.value.push({
                role: 'ai',
                message: responseAnswer.answer,
                // store references for display in UI
                references: responseAnswer.references
            });
          
            // clear input
            question.value = '';
        } catch (e) {
            console.error(e);
            error.value = 'Unfortunately, there was an error asking your question.';
        } finally {
            isLoadingMessage.value = false;
        }
    };

    return {
        askQuestion,
        question,
        isLoadingMessage,
        uiChatHistory,
        chatHistory,
        clearHistory,
        error
    }
};
