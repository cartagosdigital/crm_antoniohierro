import type { ProposalContent, ProposalLanguage } from './proposals'

// Conteúdo por defeito de uma proposta nova: é o do rascunho aprovado,
// reference/proposta.html, extraído dos pares data-pt / data-en.
//
// O preço fica "€ 0.000" de propósito, como no rascunho — é um valor a
// preencher no construtor, não um preço de tabela. A nota do rascunho dizia
// "+ IVA · valor de exemplo"; aqui fica só "+ IVA", porque "valor de exemplo"
// é uma anotação do rascunho e não texto da proposta.

const PT: ProposalContent = {
  cover: { kicker: 'Proposta de serviços', couple: '', eventLine: '' },
  intro: {
    eyebrow: 'A nossa abordagem',
    heading: 'Cada casamento é único',
    text: 'Acompanhamo-vos em cada etapa, do primeiro conceito ao último brinde, para que vivam o vosso dia sem uma única preocupação.',
  },
  packagesLabel: 'Os pacotes',
  packages: [
    {
      name: 'Gold · Planeamento Completo',
      tagline: 'Acompanhamento integral, do início ao fim.',
      price: '€ 0.000',
      priceNote: '+ IVA',
      groups: [
        {
          title: 'Coordenação completa',
          items: [
            'Acompanhamento contínuo nos 12 meses anteriores ao evento',
            'Reuniões quinzenais de alinhamento, presenciais ou por videochamada',
            'Recomendação e gestão de fornecedores, orçamentos e contratos',
            'Pasta colaborativa no Google Drive e grupo direto de WhatsApp',
          ],
        },
        {
          title: 'Pré-produção',
          items: [
            'Visitas técnicas e apoio na análise de propostas',
            'Coordenação de todos os profissionais contratados',
            'Checklist detalhado e timeline do evento',
          ],
        },
        {
          title: 'No dia do evento',
          items: [
            'Coordenação integral de toda a logística',
            'Supervisão de chegadas e montagem dos fornecedores',
            'Equipa presente desde a montagem até ao fim, até 12h',
          ],
        },
      ],
    },
    {
      name: 'Silver · Toques Finais',
      tagline: 'Apoio especializado na reta final.',
      price: '€ 0.000',
      priceNote: '+ IVA',
      groups: [
        {
          title: 'Apoio final de planeamento',
          items: [
            'Acompanhamento nos 3 meses anteriores ao evento',
            'Revisão e otimização dos contratos com fornecedores',
            'Elaboração do cronograma final',
          ],
        },
        {
          title: 'Pré-produção',
          items: [
            'Coordenação de todos os profissionais contratados',
            'Checklist detalhado e timeline do evento',
          ],
        },
        {
          title: 'No dia do evento',
          items: [
            'Coordenação integral de toda a logística',
            'Supervisão de chegadas e montagem dos fornecedores',
            'Equipa presente desde a montagem até ao fim, até 12h',
          ],
        },
      ],
    },
  ],
  steps: {
    heading: 'Próximos passos',
    text: 'Escolhido o pacote, formalizamos com o contrato e damos início ao planeamento do vosso dia.',
  },
  footerNote: 'Proposta válida por 15 dias · valores acrescidos de IVA',
}

const EN: ProposalContent = {
  cover: { kicker: 'Proposal of services', couple: '', eventLine: '' },
  intro: {
    eyebrow: 'Our approach',
    heading: 'Every wedding is unique',
    text: 'We guide you through every step, from the first idea to the final toast, so you can live your day without a single worry.',
  },
  packagesLabel: 'The packages',
  packages: [
    {
      name: 'Gold · Full Planning',
      tagline: 'Full support, from start to finish.',
      price: '€ 0.000',
      priceNote: '+ VAT',
      groups: [
        {
          title: 'Full coordination',
          items: [
            'Ongoing support in the 12 months before the event',
            'Fortnightly alignment meetings, in person or by video call',
            'Vendor recommendation and management, quotes and contracts',
            'Shared Google Drive folder and direct WhatsApp group',
          ],
        },
        {
          title: 'Pre-production',
          items: [
            'Technical visits and support in reviewing proposals',
            'Coordination of all contracted professionals',
            'Detailed checklist and event timeline',
          ],
        },
        {
          title: 'On the event day',
          items: [
            'Full coordination of all logistics',
            'Supervision of arrivals and vendor setup',
            'Team present from setup to closing, up to 12h',
          ],
        },
      ],
    },
    {
      name: 'Silver · Finishing Touches',
      tagline: 'Specialist support in the final stretch.',
      price: '€ 0.000',
      priceNote: '+ VAT',
      groups: [
        {
          title: 'Final planning support',
          items: [
            'Support in the 3 months before the event',
            'Review and optimisation of vendor contracts',
            'Preparation of the final schedule',
          ],
        },
        {
          title: 'Pre-production',
          items: [
            'Coordination of all contracted professionals',
            'Detailed checklist and event timeline',
          ],
        },
        {
          title: 'On the event day',
          items: [
            'Full coordination of all logistics',
            'Supervision of arrivals and vendor setup',
            'Team present from setup to closing, up to 12h',
          ],
        },
      ],
    },
  ],
  steps: {
    heading: 'Next steps',
    text: 'Once the package is chosen, we formalise it with the contract and begin planning your day.',
  },
  footerNote: 'Proposal valid for 15 days · values plus VAT',
}

const SEED: Record<ProposalLanguage, ProposalContent> = { pt: PT, en: EN }

// Cópia profunda: o conteúdo por defeito vai ser editado a seguir, e as
// constantes do módulo são partilhadas por todos os pedidos do servidor.
export function conteudoPorDefeito(language: ProposalLanguage): ProposalContent {
  return structuredClone(SEED[language])
}
