import { PROJECT_ID, REGION_ID } from "~/relevance-config";
import { Client } from '@relevanceai/chain';
import type PdfQa from '~/chains/pdf-qa';


export const useChain = () => {
    const error = ref<string | null>(null);
    const isLoadingMessage = ref<boolean>(false);

    const client = new Client({
        region: REGION_ID,
        project: PROJECT_ID,
    });

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

            // we can import the type for the chain to get type safety (optional)
            const response = await client.runChain<typeof PdfQa>('pdf-qa', {
                question: clonedUserInput,
                history: chatHistory.value,
            });

            const responseAnswer = response.answer;

            const MAX_HISTORY_LENGTH = 20;

            // -1 because we are about to add 2 new items to history
            if (chatHistory.value.length > MAX_HISTORY_LENGTH - 1) {
                // remove first 2 items
                chatHistory.value.splice(0, 2);
            }
             
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
