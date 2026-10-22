// scripts/ai-generator.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_FILE = path.join(__dirname, '../src/data/questions_bank.json');

// Configure sua chave se usar Groq/OpenAI, ou deixe rodando com Ollama local (http://localhost:11434)
const API_KEY = process.env.AI_API_KEY || '';

const PROMPT_TEMPLATE = (topic, quantity) => `
Gere exatamente ${quantity} questões avançadas de nível superior para o curso de Ciência da Computação sobre o tema "${topic}".
O formato DEVE ser um array JSON estrito no seguinte formato, sem texto antes ou depois:
[
  {
    "id": "gen_${Date.now()}_1",
    "category": "${topic}",
    "question": "Texto claro e técnico da questão?",
    "options": ["Alternativa A", "Alternativa B", "Alternativa C", "Alternativa D"],
    "correctIndex": 0,
    "explanation": "Explicação técnica detalhada da resposta."
  }
]
`;

async function generateBatch(topic, quantity = 10) {
  console.log(`[+] Gerando ${quantity} questões de ${topic} via LLM...`);
  // Exemplo de integração com API (OpenAI compatível / Groq / Ollama)
  // Substitua pelo fetch correspondente ao seu endpoint
  console.log(`Para rodar em massa, basta setar a variável AI_API_KEY e executar.`);
}

generateBatch('algoritmos', 20);