import { GoogleGenAI } from "@google/genai";
import { listSymbols, getQuote, QuoteData } from "@/components/api";


type ApiQuoteResponse = {
  results: any[];
};

type SymbolDataMap = {
  [key: string]: any[];
};

export type GeminiStockResponse = {
  ticker: string;
  name: string;
  date: string;
  change: string;
  price: string | number;
  description: string;
  type: 'buy' | 'sell';
  status: 'bullish' | 'bearish' | 'neutral';
};

export default class Gemini {
  private ia: GoogleGenAI;
  public constructor(){
    this.ia = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  private async generateContent(content: string): Promise<string> {
    try {
      const response = await this.ia.models.generateContent({
        model: "gemini-2.5-flash",
        contents: content,
      });
  
      return response.text ?? 'API não retornou texto.';
    } catch (error) {
      
      console.error("Erro ao chamar a API Gemini:", error);
      
      return 'Erro ao gerar conteudo';
    }
  }

  private parseJsonResponse(text: string): GeminiStockResponse[] {
    try {
      // Remove markdown code blocks se existirem
      let cleaned = text.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '');
      }

      const parsed = JSON.parse(cleaned) as GeminiStockResponse[];
      
      if (!Array.isArray(parsed)) {
        throw new Error('Resposta não é um array');
      }

      return parsed;
    } catch (error) {
      console.error('Erro ao parsear JSON do Gemini:', error);
      console.error('Texto recebido:', text);
      return [];
    }
  }

  public async buscarCotacoesMapeadas(): Promise<SymbolDataMap> {
    const getSymbols = (await listSymbols(3, 1));
    // console.log(`-------------------------Iniciando busca para: ${getSymbols.join(', ')}-------------------------`);

    const promessas: Promise<ApiQuoteResponse>[] = getSymbols.map(async symbol => {
        return await getQuote(symbol);
    });

    const resultadosArray = await Promise.all(promessas);

    const dataFinal = getSymbols.reduce((acumulador, symbol, index) => {
        const resultadoBruto = resultadosArray[index];
        const dadosExtraidos = resultadoBruto.results;
        acumulador[symbol] = dadosExtraidos;
        
        return acumulador;
    }, {} as SymbolDataMap);

    return dataFinal;
  }

  public async responseGenerator(){
    const data = await this.buscarCotacoesMapeadas();
    console.log(data);

    const prompt = `
      Você é um analista financeiro sênior especializado em mercado de ações, com profundo conhecimento em macroeconomia global, análise técnica e fundamentalista, política monetária e eventos geopolíticos.
      Sua função é interpretar dados de ações e gerar uma análise estratégica, clara e objetiva, voltada para investidores brasileiros, com foco em tomada de decisão rápida e informada.
      Siga rigorosamente as instruções abaixo para garantir coerência, clareza e confiabilidade da resposta:

      Contexto e Objetivo:
      Você receberá uma lista de ações e deverá analisar o cenário econômico e de mercado atual, identificando:
      3 ações com potencial de compra (buy).
      3 ações que indicam momento de venda (sell).
      Cada recomendação deve considerar fatores técnicos, econômicos e geopolíticos relevantes e apresentar uma breve justificativa que seja informativa e inspiradora, estimulando a confiança do investidor.

      Instruções Gerais:
      Língua: Português brasileiro.
      Tom: Profissional, analítico, direto e inspirador.
      Estilo: Curto, preciso e confiável — evite redundâncias ou linguagem informal.

      Base da análise:
      Tendências de mercado e comportamento setorial.
      Política monetária (taxas de juros, inflação, câmbio).
      Contexto geopolítico (guerras, eleições, políticas fiscais).
      Desempenho histórico e projeções econômicas.

      Entrada de Dados:

      ${data}

      Esta lista conterá informações sobre diversas ações, incluindo ticker, nome, data, variação percentual e preço.

      Tarefa:
      A partir dos dados recebidos:
      Escolha 3 ações para recomendar compra (buy).
      Escolha 3 ações para recomendar venda (sell).

      Forneça para cada uma delas:
      Ticker
      Nome da empresa
      Data (no formato DD/MM)
      Variação percentual (change)
      Preço atual (price)
      Breve justificativa (description) — contextualizando a decisão com base em fatores econômicos, setoriais e políticos.
      Tipo (type) — “buy” ou “sell”.
      Status — “bullish”, “bearish” ou “neutral”, de acordo com a tendência do ativo.

      Regras de Consistência:
      Cada descrição deve ser breve, lógica e não repetitiva.
      Não invente dados técnicos inexistentes, apenas interprete os já fornecidos.
      Mantenha coerência entre type e status:
      “buy” → tendência “bullish”.
      “sell” → tendência “bearish”.
      Nunca adicione texto fora do JSON final.
      A resposta deve ser 100% válida em formato JSON.
      Template de Resposta (Obrigatório):

      Retorne exatamente no seguinte formato:

      [
        {
          "ticker": "Código da ação (ex: PETR4)",
          "name": "Nome da empresa (ex: Petrobras)",
          "date": "Data no formato DD/MM",
          "change": "+X.XX%",
          "price": "XX.XX",
          "description": "Breve justificativa sobre o contexto econômico e motivo da recomendação.",
          "type": "buy",
          "status": "bullish"
        },
        {
          "ticker": "Código da ação (ex: VALE3)",
          "name": "Nome da empresa (ex: Vale S.A.)",
          "date": "Data no formato DD/MM",
          "change": "-X.XX%",
          "price": "XX.XX",
          "description": "Breve justificativa sobre o contexto econômico e motivo da recomendação.",
          "type": "sell",
          "status": "bearish"
        }
      ]

      Requisitos Finais:
      A resposta deve conter exatamente 6 objetos JSON (3 “buy” e 3 “sell”).
      Cada análise deve soar profissional, realista e inspiradora.
      O resultado final deve ser apenas o JSON, sem qualquer texto adicional.
    `;

    const response = await this.generateContent(prompt);
    const parsed = this.parseJsonResponse(response);
    return parsed;
  }
}