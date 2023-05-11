# Knowledge Base Chat UI (Nuxt)

This template shows off how you can set up a UI to do ChatGPT style question and answer on a knowledge base, using a [Relevance AI](https://www.relevanceai.com) chain.

I've written an [extensive guide](https://dash.readme.com/project/relevance/v4.0.0/docs/building-chatgpt-for-your-knowledge-base-with-relevance-ai-redis-openai-and-nuxt) breaking down this project in detail.

[View video of this repo in action!](https://www.loom.com/share/7191ab7c84564cb184ba6682e261f204)

## Get started

```
npm install
npm run dev
```

You should be able to chat with PDF documents used in my case study, from my local football association!

## What are chains?

Chains are functions powered at the core by LLMs (large language models). Relevance AI helps you build enterprise-ready chains and deploy them to an API. This template uses a chain I built, but you can modify it for your chain.

## Customising this template

All you need to do is change the details in the `relevance-config.ts` file to match your chain! I recommend, for this sort of conversation UI, to have your chain match the conditions laid out in the accompanying guide. We provide a template chain to clone, which works out of the box with this UI.

## Why Nuxt?

The Relevance AI engineering team are big fans of Vue and Nuxt. We use it for our frontend and find it very easy to onboard. That being said, we are big fans of many parts of the frontend ecosystem and will be releasing templates for frameworks such as Next and Sveltekit soon!

## Need any help?

I'm Dan, one of the founding team at Relevance AI. My inbox is always open on [Twitter](https://www.twitter.com/userlastname) or for more information about Relevance AI, head to [our website](https://www.relevanceai.com).
