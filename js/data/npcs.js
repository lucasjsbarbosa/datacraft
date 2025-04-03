// Definições dos NPCs do jogo
const NPCS_DATA = {
    // Mentores
    "prof_silva": {
        id: "prof_silva",
        name: "Prof. Silva",
        type: "mentor",
        title: "Professor de Ciência de Dados",
        description: "Um professor dedicado com vasta experiência em fundamentos de dados.",
        position: { x: 0, y: 0 }, // Será posicionado conforme o edifício
        color: 0x4CAF50, // Verde
        radius: 15,
        building: "data_university",
        specialty: "Fundamentos de Dados",
        skills_taught: ["Python", "SQL", "Estatística Básica"],
        dialogues: {
            greeting: "Olá, estudante! Precisa de ajuda com fundamentos de ciência de dados?",
            farewell: "Continue estudando! O caminho do conhecimento é longo, mas recompensador.",
            quest_offer: "Tenho um desafio para você. Quer aprender mais sobre {skill}?"
        }
    },
    "dra_oliveira": {
        id: "dra_oliveira",
        name: "Dra. Oliveira",
        type: "mentor",
        title: "Cientista de Dados Sênior",
        description: "Uma respeitada especialista em machine learning e deep learning.",
        position: { x: 0, y: 0 },
        color: 0x2196F3, // Azul
        radius: 15,
        building: "data_university",
        specialty: "Machine Learning",
        skills_taught: ["Machine Learning", "Redes Neurais", "Python Avançado"],
        dialogues: {
            greeting: "Bem-vindo! Interessado em explorar os mistérios do machine learning?",
            farewell: "Lembre-se: dados limpos são o segredo de bons modelos!",
            quest_offer: "Preciso de ajuda com um modelo preditivo. Interessado?"
        }
    },
    // Colegas
    "ana": {
        id: "ana",
        name: "Ana",
        type: "colleague",
        title: "Cientista de Dados Júnior",
        description: "Uma colega entusiasmada que recentemente começou na área.",
        position: { x: 0, y: 0 },
        color: 0xFFC107, // Amarelo
        radius: 15,
        building: "tech_startup",
        company: "TechStart Inc.",
        skills: ["Python", "Visualização de Dados", "SQL Básico"],
        dialogues: {
            greeting: "Oi! Também está começando no mundo dos dados?",
            farewell: "Foi bom conversar! Me procure se precisar de ajuda.",
            tip: "Dica: pratique visualizações com matplotlib todos os dias!"
        }
    },
    "pedro": {
        id: "pedro",
        name: "Pedro",
        type: "colleague",
        title: "Engenheiro de Dados",
        description: "Um engenheiro de dados experiente com foco em infraestrutura.",
        position: { x: 0, y: 0 },
        color: 0xFF5722, // Laranja escuro
        radius: 15,
        building: "big_corp",
        company: "MegaCorp Analytics",
        skills: ["SQL Avançado", "Big Data", "Spark", "AWS"],
        dialogues: {
            greeting: "E aí, como vai? Algum problema com pipelines de dados?",
            farewell: "Se precisar de ajuda com big data, pode me chamar.",
            tip: "Lembre-se: otimização de queries pode economizar milhares em infraestrutura!"
        }
    },
    // Clientes
    "sr_rodrigues": {
        id: "sr_rodrigues",
        name: "Sr. Rodrigues",
        type: "client",
        title: "Gerente de Marketing",
        description: "Um gerente de marketing buscando insights sobre campanhas.",
        position: { x: 0, y: 0 },
        color: 0x9C27B0, // Roxo
        radius: 15,
        building: "big_corp",
        company: "Retail Solutions",
        problem: "Precisamos entender melhor a eficácia de nossas campanhas de marketing.",
        task_id: "campaign_analysis",
        dialogues: {
            greeting: "Olá! Você é o novo analista de dados? Temos um problema urgente.",
            task_description: "Temos dados de 30 campanhas recentes, mas não sabemos quais fatores mais influenciam a conversão.",
            success: "Excelente trabalho! Esses insights vão transformar nossa estratégia."
        }
    }
};