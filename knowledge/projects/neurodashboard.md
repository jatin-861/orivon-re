# NeuroDashboard

## Multi-module AI platform

---

## Executive Summary

NeuroDashboard is a multi-module AI platform built and shipped end-to-end by Saral Banker (with Jatin Basantani contributing to Knowledge Hub). Over 70,000 lines of production code. Currently in active use across its core modules.

**Slug:** `neurodashboard`  
**Year:** 2024–2025  
**Client:** Independent  
**Category:** AI Platform  
**GitHub:** https://github.com/saralbanker/neuro-zenith  
**Schema creator:** Orvion.co

---

## Problem

Information ends up scattered — notes, documents, tasks, and conversations live in different tools that don't talk to each other. Finding an answer means searching five places simultaneously. Busywork piles up around all of it.

---

## Solution

A unified platform that puts all information in one place, makes it instantly searchable via semantic RAG, and automates the busywork — without depending on a single AI provider that might go down.

---

## Architecture

**Frontend:** React 18 (component library), served as SPA  
**Backend:** Node.js / Express REST API  
**Database:** PostgreSQL with pgvector extension (semantic search)  
**Cache / Queue:** Redis + BullMQ (async job processing)  
**Real-time:** Socket.IO (collaborative notes, live updates)  
**AI routing:** OpenRouter, Gemini, Qwen (multi-provider fallback)  
**CI/CD:** GitHub Actions  
**Monitoring:** Sentry + Prometheus

---

## Modules

| Module                       | Flagship? | Description                                                                      |
| ---------------------------- | --------- | -------------------------------------------------------------------------------- |
| Knowledge Hub                | YES       | Semantic search across all documents and notes via pgvector (RAG over 12k+ docs) |
| Analytics Dashboard          | —         | Activity, trends, and usage breakdown by workspace                               |
| AI Insights Engine           | —         | Multi-provider LLM routing (OpenRouter/Gemini/Qwen) — no single point of failure |
| Workflow Automation          | —         | Async background jobs via BullMQ/Redis — heavy tasks don't block UI              |
| Notes System                 | —         | Real-time collaborative notes via Socket.IO                                      |
| Document Processing Pipeline | —         | Auto-ingestion, chunking, and indexing on upload                                 |

---

## Tech Stack

```
React · Node.js/Express · PostgreSQL · Redis · pgvector · Socket.IO · BullMQ ·
OpenRouter · Gemini · Qwen · GitHub Actions · Sentry · Prometheus
```

---

## Engineering Decisions

1. **Multi-provider LLM routing** instead of single API — no single point of failure for AI features
2. **pgvector for semantic search** instead of a separate vector database — one less moving part in the infrastructure
3. **BullMQ/Redis async queue** for document processing and heavy tasks — keeps UI responsive
4. **Multi-tenant access control** — each workspace sees only its own data

---

## Technical Challenges

- Keeping semantic search fast as the document index grows past 12k docs
- Handling AI provider outages and rate limits gracefully, mid-request
- Maintaining consistency across real-time collaborative sessions
- Reliable ingestion for messy, real-world file formats

---

## Current Status

Live and in active use. Core modules running: Knowledge Hub, Notes, Tasks, AI Insights Engine.

---

## Evidence for Portfolio

- 70k+ lines of production code
- 6 distinct modules
- RAG pipeline over 12,000+ documents
- Multi-provider AI routing (3 providers)
- GitHub: github.com/saralbanker/neuro-zenith

---

## Future Roadmap

- Additional AI provider fallbacks and model routing improvements
- Expanded analytics across workspaces
- Mobile-friendly companion experience

---

## Portfolio Representation

**Homepage:** Featured in ScrollStoryHorizontal and (currently) StudioShowreel  
**Work index:** First card (`/work`)  
**Case study:** Full case study at `/work/neurodashboard` with all module cards  
**Image:** `/public/images/neurodashboard.webp`  
**Brand color:** `#C75B3A` (brand-pink)
