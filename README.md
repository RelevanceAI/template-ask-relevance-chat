# Knowledge Base Chat UI (Nuxt)

This template shows off how you can set up a UI to do ChatGPT style question and answer on a knowledge base, using a [Relevance AI](https://documentation.relevanceai.com/) chain.

[**Read the accompanying guide!**](https://documentation.relevanceai.com/guides/pdf-qa)

To create the demo dataset for this frontend, use this [Google Colab](https://colab.research.google.com/drive/1XYaRamHmHop3GV4MGTMaDZjRZuWfMy9O?usp=sharing).

[View video of this repo in action!](https://www.loom.com/share/7191ab7c84564cb184ba6682e261f204)

## Get started

To boot up the frontend:

```
npm install
npm run dev
```

To deploy the chains created in the `chains` folder, we use the Relevance AI CLI.

`npm install -g @relevanceai/chain`

Run `relevance login` to authenticate the CLI.

Then `relevance deploy` to deploy your chains!

Make sure to set your relevant account details in `relevance-config.ts`.

## Configuring this template

## Need any help?

I'm Dan, one of the founding team at Relevance AI. My inbox is always open on [Twitter](https://www.twitter.com/userlastname) or for more information about Relevance AI, head to [our website](https://www.relevanceai.com).
